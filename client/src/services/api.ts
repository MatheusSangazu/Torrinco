import axios from 'axios';

// ── Access token em memória (NUNCA em localStorage) ──────────────
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ── Instância Axios ──────────────────────────────────────────────
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // ESSENCIAL: envia cookies HttpOnly cross-origin
});

// Request interceptor: anexa Bearer token do estado em memória.
api.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toLowerCase();
  if (typeof navigator !== 'undefined' && !navigator.onLine && method !== 'get') {
    return Promise.reject(Object.assign(new Error('Operação indisponível offline. Aguarde a conexão voltar.'), { code: 'OFFLINE_MUTATION_BLOCKED' }));
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Refresh token queue (evita múltiplas chamadas simultâneas) ───
let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  queue = [];
}

// Response interceptor: em 401, tenta refresh via cookie HttpOnly.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Não tenta refresh em rotas de auth.
    if (originalRequest.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Enfileira até o refresh em andamento terminar.
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token é enviado automaticamente via cookie (withCredentials).
        // Não enviamos nada no body — o servidor lê o cookie.
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newToken } = response.data;
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
