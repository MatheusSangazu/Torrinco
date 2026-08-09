import crypto from 'crypto';
import { google } from 'googleapis';
import { prisma } from '../../lib/prisma.js';

/**
 * Autenticação OAuth2 com o Google.
 *
 * Abordagem: OAuth2 com User Consent — cada usuário autoriza uma vez e recebe
 * um refresh_token permanente (gravado no banco). O access_token (1h) é renovado
 * automaticamente pela própria biblioteca googleapis a cada chamada.
 *
 * O `state` do fluxo OAuth carrega o userId de forma assinada (HMAC), permitindo
 * resolver o usuário no callback sem expor o id direto nem depender de sessão.
 */

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
];

/** Segredo usado para assinar o `state` do OAuth (reaproveita o JWT_SECRET). */
function stateSecret(): string {
  return process.env.JWT_SECRET || 'torrinco-google-oauth-fallback';
}

/**
 * Cria o cliente OAuth2 base (sem credenciais), configurado com as env vars.
 * Lança erro explícito se faltar configuração — falha cedo.
 */
function createBaseClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI precisam estar definidos no .env'
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Assina um userId para uso como `state` no OAuth: `${userId}.${hmac}`.
 * O HMAC impede que alguém forje um state apontando para outro usuário.
 */
function signState(userId: number): string {
  const hmac = crypto.createHmac('sha256', stateSecret()).update(String(userId)).digest('hex');
  return `${userId}.${hmac}`;
}

/** Verifica e extrai o userId de um `state` assinado. Retorna null se inválido. */
export function verifyState(state: string): number | null {
  const [idPart, hmac] = state.split('.');
  if (!idPart || !hmac) return null;
  const expected = crypto.createHmac('sha256', stateSecret()).update(idPart).digest('hex');
  // comparison time-safe.
  if (expected.length !== hmac.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ hmac.charCodeAt(i);
  }
  if (diff !== 0) return null;
  const userId = Number(idPart);
  return Number.isInteger(userId) ? userId : null;
}

/**
 * Gera a URL de autorização do Google para o usuário.
 * O agente envia essa URL no WhatsApp; o usuário clica, autoriza e cai no callback.
 */
export function getAuthUrl(userId: number): string {
  const client = createBaseClient();
  return client.generateAuthUrl({
    access_type: 'offline',          // exige refresh_token
    prompt: 'consent',               // força consent para garantir refresh_token em reautorizações
    include_granted_scopes: true,
    scope: SCOPES,
    state: signState(userId)
  });
}

/**
 * Troca o código de autorização pelos tokens.
 * Retorna { access_token, refresh_token, expiry_date }.
 */
export async function exchangeCode(code: string): Promise<{
  access_token: string | null;
  refresh_token: string | null;
  expiry_date: number | null;
}> {
  const client = createBaseClient();
  const { tokens } = await client.getToken(code);
  return {
    access_token: tokens.access_token ?? null,
    refresh_token: tokens.refresh_token ?? null,
    expiry_date: tokens.expiry_date ?? null
  };
}

/** Verifica se o usuário já conectou o Google (tem refresh_token salvo). */
export async function isConnected(userId: number): Promise<boolean> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { google_refresh_token: true }
  });
  return !!user?.google_refresh_token;
}

// Cache de clientes autenticados por usuário (evita renovar access_token toda chamada).
const clientCache = new Map<number, any>();

/**
 * Retorna um OAuth2Client autenticado para o usuário.
 * Usa o refresh_token do banco; o access_token (1h) é renovado em memória pela
 * própria googleapis quando expira.
 */
export async function getOAuth2Client(userId: number) {
  const cached = clientCache.get(userId);
  if (cached) return cached;

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { google_refresh_token: true, google_calendar_id: true }
  });

  if (!user?.google_refresh_token) {
    throw new Error('GOOGLE_NOT_CONNECTED');
  }

  const client = createBaseClient();
  client.setCredentials({ refresh_token: user.google_refresh_token });

  // Pré-aquece o access_token pra falhar cedo se o refresh foi revogado.
  try {
    await client.getAccessToken();
  } catch (err) {
    // Refresh inválido (revogado/app em testing > 7 dias) → sinaliza desconexão.
    throw new Error('GOOGLE_TOKEN_REVOKED');
  }

  clientCache.set(userId, client);
  return client;
}

/** Invalida o cliente em cache (chamar ao trocar/desconectar tokens). */
export function invalidateClient(userId: number): void {
  clientCache.delete(userId);
}

export async function disconnectGoogle(userId:number):Promise<{revoked:boolean}> {
  const user=await prisma.users.findUnique({where:{id:userId},select:{google_refresh_token:true}});
  let revoked=false;
  if(user?.google_refresh_token){
    try{const client=createBaseClient();await client.revokeToken(user.google_refresh_token);revoked=true}catch{/* token pode já estar inválido; limpeza local continua */}
  }
  await prisma.users.update({where:{id:userId},data:{google_refresh_token:null,google_email:null,google_calendar_id:null}});
  invalidateClient(userId);
  return {revoked};
}

/** Retorna o calendar_id configurado pelo usuário (default "primary"). */
export async function getCalendarId(userId: number): Promise<string> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { google_calendar_id: true }
  });
  return user?.google_calendar_id || 'primary';
}
