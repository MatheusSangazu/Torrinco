import type { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { assertWithinLimit } from '../services/subscription.service.js';
import { generateAccessToken, type JwtRequest } from '../middleware/jwt.js';
import { EvolutionService } from '../services/evolution.service.js';
import { RefreshTokenService } from '../services/refresh-token.service.js';
import { VerificationService } from '../services/verification.service.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromCookies } from '../lib/cookie.js';
import { maskPhone } from '../lib/mask.js';
import { recordCurrentConsents } from '../services/privacy.service.js';

// Senhas comuns e óbvias que devem ser bloqueadas.
const COMMON_PASSWORDS = new Set([
  '123456', '123456789', '12345678', 'password', 'senha', '111111',
  '000000', '123123', '654321', 'abc123', 'qwerty', 'senha123',
]);

export class AuthController {
  
   //Solicita redefinição de senha 
   
  static async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number } = req.body;
      const user = await AuthController.findUserByPhone(phone_number);

      // Resposta neutra para evitar enumeração de usuário.
      if (user) {
        const code = await VerificationService.createChallenge(
          user.id, user.phone_number, 'password_reset',
        );
        const message = `*Recuperação de Senha - Torrinco*\n\nSeu código de verificação é: *${code}*\n\nSe você não solicitou, ignore esta mensagem.`;
        EvolutionService.sendText(user.phone_number, message)
          .then(() => console.log(`📨 Código de recuperação enviado para ${maskPhone(user.phone_number)}`))
          .catch(err => console.error('❌ Falha no envio do WhatsApp:', err));
      } else {
        console.log(`🚫 Solicitação de reset para telefone inexistente: ${maskPhone(phone_number)}`);
      }

      // Sempre retorna sucesso (impede enumeração).
      res.json({ message: 'Se o telefone estiver cadastrado, um código foi enviado.' });
    } catch (error) {
      console.error('❌ Erro no AuthController.requestPasswordReset:', error);
      next(error);
    }
  }

  
   //Redefine a senha usando o código
   
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, code, new_password } = req.body;
      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(400).json({ error: 'Código inválido ou expirado' });
      }

      const result = await VerificationService.verifyAndConsume(
        user.phone_number, code, 'password_reset',
      );
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }

      const pwError = AuthController.validatePassword(new_password);
      if (pwError) {
        return res.status(400).json({ error: pwError });
      }

      const new_password_hash = await bcrypt.hash(new_password, 10);
      await prisma.users.update({
        where: { id: user.id },
        data: { password_hash: new_password_hash },
      });

      console.log(`✅ Senha redefinida para o usuário ${user.id}`);
      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.resetPassword:', error);
      next(error);
    }
  }

  
   // Solicita código de verificação para primeiro acesso
   
  static async requestFirstAccessCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number } = req.body;
      const user = await AuthController.findUserByPhone(phone_number);

      // Resposta neutra para evitar enumeração de usuário.
      if (user && !user.password_hash) {
        const code = await VerificationService.createChallenge(
          user.id, user.phone_number, 'first_access',
        );
        const message = `*Primeiro Acesso - Torrinco*\n\nSeu código de verificação é: *${code}*\n\nUse este código para criar sua senha e ativar sua conta.`;
        EvolutionService.sendText(user.phone_number, message)
          .then(() => console.log(`📨 Código de primeiro acesso enviado para ${maskPhone(user.phone_number)}`))
          .catch(err => console.error('❌ Falha no envio do WhatsApp:', err));
      } else {
        console.log(`🚫 Solicitação de primeiro acesso sem usuário elegível: ${maskPhone(phone_number)}`);
      }

      // Sempre retorna sucesso (impede enumeração).
      res.json({ message: 'Se o telefone estiver cadastrado e elegível, um código foi enviado.' });
    } catch (error) {
      console.error('❌ Erro no AuthController.requestFirstAccessCode:', error);
      next(error);
    }
  }

  
  static async validateFirstAccessCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, code } = req.body;
      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(400).json({ error: 'Código inválido ou expirado' });
      }

      // Não consome o código — apenas verifica.
      const result = await VerificationService.verifyCode(
        user.phone_number, code, 'first_access', false,
      );
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ message: 'Código validado com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.validateFirstAccessCode:', error);
      next(error);
    }
  }

  /**
   * Cria um novo usuário 
   */
  static async createUser(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const accountId = req.accountId!;
      const { name, phone_number, email } = req.body;

      await assertWithinLimit(accountId, 'users');

      if (!name || !phone_number) {
        return res.status(400).json({ error: 'Nome e número de telefone são obrigatórios' });
      }

      const existingUser = await prisma.users.findUnique({
        where: { phone_number }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Já existe um usuário com este número de telefone' });
      }

      const user = await prisma.users.create({
        data: {
          account_id: accountId,
          phone_number,
          name,
          email,
          role: 'member',
          status: 'active'
        },
        select: {
          id: true,
          phone_number: true,
          name: true,
          email: true,
          role: true,
          status: true,
          created_at: true,
          account_id: true
        }
      });

      // Criar categorias padrão
      const defaultCategories = [
        // Receitas
        { name: 'Salário', type: 'income', color: '#22c55e' },
        { name: 'Freelance', type: 'income', color: '#10b981' },
        { name: 'Investimentos', type: 'income', color: '#0ea5e9' },
        { name: 'Presentes', type: 'income', color: '#8b5cf6' },
        { name: 'Outros', type: 'income', color: '#64748b' },
        
        // Despesas
        { name: 'Alimentação', type: 'expense', color: '#ef4444' },
        { name: 'Moradia', type: 'expense', color: '#f97316' },
        { name: 'Transporte', type: 'expense', color: '#eab308' },
        { name: 'Saúde', type: 'expense', color: '#ec4899' },
        { name: 'Educação', type: 'expense', color: '#3b82f6' },
        { name: 'Lazer', type: 'expense', color: '#8b5cf6' },
        { name: 'Compras', type: 'expense', color: '#f43f5e' },
        { name: 'Contas Fixas', type: 'expense', color: '#6366f1' }
      ];

      await prisma.categories.createMany({
        data: defaultCategories.map(cat => ({
          account_id: accountId,
          name: cat.name,
          type: cat.type,
          color: cat.color
        }))
      });
      console.log(`✅ Categorias padrão criadas para o usuário ${user.id}`);

      console.log('✅ Usuário criado com sucesso:', user.id);
      res.status(201).json({ user });
    } catch (error) {
      console.error('❌ Erro no AuthController.createUser:', error);
      next(error);
    }
  }

  
   // Define a senha no primeiro acesso (com validação de código)
   
  static async createPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, code, password, accept_terms, accept_privacy } = req.body;
      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(400).json({ error: 'Código inválido ou expirado' });
      }
      if (accept_terms !== true || accept_privacy !== true) return res.status(400).json({ error: 'O aceite explícito dos Termos e da Política de Privacidade é obrigatório' });

      if (user.password_hash) {
        return res.status(400).json({ error: 'Senha já definida' });
      }

      const result = await VerificationService.verifyAndConsume(
        user.phone_number, code, 'first_access',
      );
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }

      const pwError = AuthController.validatePassword(password);
      if (pwError) {
        return res.status(400).json({ error: pwError });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: { password_hash },
        select: {
          id: true,
          phone_number: true,
          name: true,
          email: true,
          role: true,
          status: true,
          account_id: true,
        },
      });
      await recordCurrentConsents({ userId:updatedUser.id, accountId:updatedUser.account_id, origin:'pwa_first_access', ip:req.ip, userAgent:req.get('user-agent'), evidence:{flow:'first_access'} });

      const createPasswordPayload = {
        userId: updatedUser.id,
        accountId: updatedUser.account_id,
        userRole: updatedUser.role ?? 'user',
      };

      const accessToken = generateAccessToken(createPasswordPayload);
      const refreshToken = await RefreshTokenService.createRefreshToken(
        updatedUser.id, updatedUser.account_id, updatedUser.role ?? 'user',
      );

      console.log(`✅ Senha criada para o usuário ${updatedUser.id}`);
      setRefreshTokenCookie(res, refreshToken);
      res.json({ user: updatedUser, accessToken });
    } catch (error) {
      console.error('❌ Erro no AuthController.createPassword:', error);
      next(error);
    }
  }

  /**
   * Valida a política de senha.
   * - Mínimo 8 caracteres.
   * - Pelo menos 1 letra e 1 número.
   * - Não pode ser senha óbvia/comum.
   * Retorna mensagem de erro ou null se válida.
   */
  private static validatePassword(password: string): string | null {
    if (password.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres';
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return 'A senha deve conter letras e números';
    }
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      return 'Esta senha é muito comum. Escolha uma senha mais segura.';
    }
    return null;
  }

  
    //para encontrar usuário buscando por telefone com ou sem o 9º dígito
   
  private static async findUserByPhone(phoneNumber: string) {
    
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    
    if (cleanPhone.length < 10) {
      return prisma.users.findUnique({ where: { phone_number: phoneNumber } });
    }

    
    
    let phoneVariations: string[] = [phoneNumber]; // Busca exata original
    
    
    let localNumber = cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone;
    
    if (localNumber.length === 11) {
      
      const withoutNine = '55' + localNumber.substring(0, 2) + localNumber.substring(3);
      phoneVariations.push(withoutNine);
    } else if (localNumber.length === 10) {
      
      const withNine = '55' + localNumber.substring(0, 2) + '9' + localNumber.substring(2);
      phoneVariations.push(withNine);
    }

    console.log('🔍 Buscando usuário com variações de telefone:', phoneVariations.map(maskPhone));

    
    return prisma.users.findFirst({
      where: {
        phone_number: {
          in: phoneVariations
        }
      },
      select: {
        id: true,
        phone_number: true,
        password_hash: true,
        role: true,
        account_id: true,
        name: true,
        email: true,
        status: true
      }
    });
  }

  
  static async me(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          role: true,
          status: true,
          account_id: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ user });
    } catch (error) {
      console.error('❌ Erro no AuthController.me:', error);
      next(error);
    }
  }

  
  static async login(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number, password } = req.body;

      if (!phone_number || !password) {
        return res.status(400).json({ error: 'Número de telefone e senha são obrigatórios' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Credenciais inválidas ou senha não definida' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Conta de usuário não está ativa' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const loginPayload = {
        userId: user.id,
        accountId: user.account_id,
        userRole: user.role ?? 'user'
      };

      const accessToken = generateAccessToken(loginPayload);

      const refreshToken = await RefreshTokenService.createRefreshToken(
        user.id,
        user.account_id,
        user.role ?? 'user'
      );

      const { password_hash, ...userWithoutPassword } = user;

      // Refresh token em cookie HttpOnly; access token apenas no body.
      setRefreshTokenCookie(res, refreshToken);
      console.log('✅ Login realizado com sucesso:', phone_number);
      res.json({ user: userWithoutPassword, accessToken });
    } catch (error) {
      console.error('❌ Erro no AuthController.login:', error);
      next(error);
    }
  }

  
  static async changePassword(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const userId = req.userId!;
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        return res.status(400).json({ error: 'Senha antiga e nova são obrigatórias' });
      }

      const pwError = AuthController.validatePassword(new_password);
      if (pwError) {
        return res.status(400).json({ error: pwError });
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { id: true, password_hash: true }
      });

      if (!user || !user.password_hash) {
        return res.status(404).json({ error: 'Usuário não encontrado ou senha não definida' });
      }

      const isPasswordValid = await bcrypt.compare(old_password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha antiga inválida' });
      }

      const new_password_hash = await bcrypt.hash(new_password, 10);

      await prisma.users.update({
        where: { id: userId },
        data: { password_hash: new_password_hash }
      });

      console.log('✅ Senha alterada com sucesso para o usuário:', userId);
      res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.changePassword:', error);
      next(error);
    }
  }

  
  static async listUsers(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const accountId = req.accountId!;

      const users = await prisma.users.findMany({
        where: { 
          account_id: accountId,
          status: 'active' 
        },
        select: {
          id: true,
          phone_number: true,
          name: true,
          email: true,
          role: true,
          status: true,
          created_at: true
        }
      });

      res.json({ users });
    } catch (error) {
      console.error('❌ Erro no AuthController.listUsers:', error);
      next(error);
    }
  }

  
   // Atualiza dados de um usuário 
   
  static async updateUser(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const accountId = req.accountId!;
      const { id } = req.params;
      const { name, email, role, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
      }

      // Verifica se o usuário pertence à mesma conta
      const existingUser = await prisma.users.findFirst({
        where: { id: Number(id), account_id: accountId }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const updatedUser = await prisma.users.update({
        where: { id: Number(id) },
        data: {
          name: name ?? undefined,
          email: email ?? undefined,
          role: role ?? undefined,
          status: status ?? undefined
        },
        select: {
          id: true,
          phone_number: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      });

      console.log('✅ Usuário atualizado com sucesso:', id);
      res.json({ user: updatedUser });
    } catch (error) {
      console.error('❌ Erro no AuthController.updateUser:', error);
      next(error);
    }
  }

  
   // Exclusão
   
  static async deleteUser(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const accountId = req.accountId!;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
      }

      // Verifica se o usuário pertence à mesma conta
      const existingUser = await prisma.users.findFirst({
        where: { id: Number(id), account_id: accountId }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      
      if (Number(id) === req.userId) {
        return res.status(400).json({ error: 'Não é possível excluir sua própria conta de administrador' });
      }

      await prisma.users.update({
        where: { id: Number(id) },
        data: { status: 'inactive', google_refresh_token: null }
      });

      // Revoga TODAS as sessões ativas do usuário.
      await RefreshTokenService.revokeAllUserTokens(Number(id));

      console.log('✅ Usuário desativado e sessões revogadas:', id);
      res.json({ message: 'Usuário excluído (desativado) com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.deleteUser:', error);
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Refresh token vem do cookie HttpOnly (fallback para body durante transição).
      const refreshToken = getRefreshTokenFromCookies(req as any) ?? req.body?.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token é obrigatório' });
      }

      const { accessToken, refreshToken: newRefreshToken } = await RefreshTokenService.rotateRefreshToken(refreshToken);
      setRefreshTokenCookie(res, newRefreshToken);
      res.json({ accessToken });
    } catch (error) {
      console.error('❌ Erro no AuthController.refreshToken:', error);
      clearRefreshTokenCookie(res);
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async logout(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      // Refresh token vem do cookie HttpOnly (fallback para body durante transição).
      const refreshToken = getRefreshTokenFromCookies(req as any) ?? req.body?.refreshToken;

      if (refreshToken) {
        await RefreshTokenService.revokeRefreshToken(refreshToken);
      }
      clearRefreshTokenCookie(res);
      res.json({ ok: true });
    } catch (error) {
      console.error('❌ Erro no AuthController.logout:', error);
      next(error);
    }
  }
}
