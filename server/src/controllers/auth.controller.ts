import type { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { generateAccessToken, type JwtRequest } from '../middleware/jwt.js';
import { EvolutionService } from '../services/evolution.service.js';
import { RefreshTokenService } from '../services/refresh-token.service.js';

// Rever caso escale para múltiplos servidores
const resetCodes = new Map<string, { code: string, expires: number }>();
const firstAccessCodes = new Map<string, { code: string, expires: number }>();

export class AuthController {
  
   //Solicita redefinição de senha 
   
  static async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number } = req.body;

      if (!phone_number) {
        return res.status(400).json({ error: 'Número de telefone é obrigatório' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Gerar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Salvar código com validade de 15 minutos
      // Usar o telefone normalizado do usuário encontrado para garantir consistência
      const targetPhone = user.phone_number;
      
      resetCodes.set(targetPhone, {
        code,
        expires: Date.now() + 15 * 60 * 1000
      });

      
      const message = `*Recuperação de Senha - Torrinco*\n\nSeu código de verificação é: *${code}*\n\nSe você não solicitou, ignore esta mensagem.`;
      
      
      EvolutionService.sendText(targetPhone, message)
        .then(() => console.log('📨 Código enviado via WhatsApp para', targetPhone))
        .catch(err => console.error('❌ Falha no envio do WhatsApp:', err));

      console.log('🔑 CÓDIGO DE RECUPERAÇÃO GERADO (Backup):', code, 'para', targetPhone);

      res.json({ message: 'Código enviado com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.requestPasswordReset:', error);
      next(error);
    }
  }

  
   //Redefine a senha usando o código
   
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number, code, new_password } = req.body;

      if (!phone_number || !code || !new_password) {
        return res.status(400).json({ error: 'Número de telefone, código e nova senha são obrigatórios' });
      }

      // Buscar o usuário para garantir que estamos usando o telefone correto
      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      const stored = resetCodes.get(user.phone_number);

      if (!stored) {
        return res.status(400).json({ error: 'Solicitação de redefinição não encontrada ou expirada' });
      }

      if (Date.now() > stored.expires) {
        resetCodes.delete(user.phone_number);
        return res.status(400).json({ error: 'Código expirado' });
      }

      if (stored.code !== code) {
        return res.status(400).json({ error: 'Código inválido' });
      }

      if (new_password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      const new_password_hash = await bcrypt.hash(new_password, 10);

      await prisma.users.update({
        where: { id: user.id }, 
        data: { password_hash: new_password_hash }
      });

      // Limpar código usado
      resetCodes.delete(user.phone_number);

      console.log('✅ Senha redefinida com sucesso para:', user.phone_number);
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

      if (!phone_number) {
        return res.status(400).json({ error: 'Número de telefone é obrigatório' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (user.password_hash) {
        return res.status(400).json({ error: 'Senha já definida. Por favor, faça login.' });
      }

      // Gerar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // código com validade de 15 minutos
      const targetPhone = user.phone_number;
      
      firstAccessCodes.set(targetPhone, {
        code,
        expires: Date.now() + 15 * 60 * 1000
      });

      
      const message = `*Primeiro Acesso - Torrinco*\n\nSeu código de verificação é: *${code}*\n\nUse este código para criar sua senha e ativar sua conta.`;
      
      
      EvolutionService.sendText(targetPhone, message)
        .then(() => console.log('📨 Código de primeiro acesso enviado via WhatsApp para', targetPhone))
        .catch(err => console.error('❌ Falha no envio do WhatsApp:', err));

      console.log('🔑 CÓDIGO DE PRIMEIRO ACESSO GERADO (Backup):', code, 'para', targetPhone);

      res.json({ message: 'Código enviado com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.requestFirstAccessCode:', error);
      next(error);
    }
  }

  
  static async validateFirstAccessCode(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number, code } = req.body;

      if (!phone_number || !code) {
        return res.status(400).json({ error: 'Número de telefone e código são obrigatórios' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const stored = firstAccessCodes.get(user.phone_number);

      if (!stored) {
        return res.status(400).json({ error: 'Código de verificação não encontrado ou expirado' });
      }

      if (Date.now() > stored.expires) {
        firstAccessCodes.delete(user.phone_number);
        return res.status(400).json({ error: 'Código expirado' });
      }

      if (stored.code !== code) {
        return res.status(400).json({ error: 'Código inválido' });
      }

      console.log('✅ Código de primeiro acesso validado para:', phone_number);
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
      const { phone_number, code, password } = req.body;

      if (!phone_number || !code || !password) {
        return res.status(400).json({ error: 'Número de telefone, código e senha são obrigatórios' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (user.password_hash) {
        return res.status(400).json({ error: 'Senha já definida' });
      }

      const stored = firstAccessCodes.get(user.phone_number);

      if (!stored) {
        return res.status(400).json({ error: 'Código de verificação não encontrado ou expirado' });
      }

      if (Date.now() > stored.expires) {
        firstAccessCodes.delete(user.phone_number);
        return res.status(400).json({ error: 'Código expirado' });
      }

      if (stored.code !== code) {
        return res.status(400).json({ error: 'Código inválido' });
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
          account_id: true
        }
      });

      const createPasswordPayload = {
        userId: updatedUser.id,
        accountId: updatedUser.account_id,
        userRole: updatedUser.role ?? 'user'
      };

      const accessToken = generateAccessToken(createPasswordPayload);

      const refreshToken = await RefreshTokenService.createRefreshToken(
        updatedUser.id,
        updatedUser.account_id,
        updatedUser.role ?? 'user'
      );

      // Limpar código 
      firstAccessCodes.delete(user.phone_number);

      console.log('✅ Senha criada e token gerado para:', phone_number);
      res.json({ user: updatedUser, accessToken, refreshToken });
    } catch (error) {
      console.error('❌ Erro no AuthController.createPassword:', error);
      next(error);
    }
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

    console.log('🔍 Buscando usuário com variações de telefone:', phoneVariations);

    
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

      console.log('✅ Login realizado com sucesso:', phone_number);
      res.json({ user: userWithoutPassword, accessToken, refreshToken });
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

      if (new_password.length < 6) {
        return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres' });
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
        data: { status: 'inactive' }
      });

      console.log('✅ Usuário desativado com sucesso:', id);
      res.json({ message: 'Usuário excluído (desativado) com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.deleteUser:', error);
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token é obrigatório' });
      }

      const { accessToken, refreshToken: newRefreshToken } = await RefreshTokenService.rotateRefreshToken(refreshToken);
      res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error('❌ Erro no AuthController.refreshToken:', error);
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async logout(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token é obrigatório' });
      }

      await RefreshTokenService.revokeRefreshToken(refreshToken);

      console.log('✅ Logout realizado com sucesso');
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('❌ Erro no AuthController.logout:', error);
      next(error);
    }
  }
}