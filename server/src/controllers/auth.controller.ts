import type { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { generateToken, type JwtRequest } from '../middleware/jwt.js';
import { EvolutionService } from '../services/evolution.service.js';

// Armazenamento temporário de códigos de redefinição (Em produção, usar Redis ou DB)
const resetCodes = new Map<string, { code: string, expires: number }>();

export class AuthController {
  /**
   * Solicita redefinição de senha (Gera código)
   */
  static async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number } = req.body;

      if (!phone_number) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        
        return res.status(404).json({ error: 'User not found' });
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

      // Enviar via Evolution API
      const message = `*Recuperação de Senha - Torrinco*\n\nSeu código de verificação é: *${code}*\n\nSe você não solicitou, ignore esta mensagem.`;
      
      // Envio assíncrono para não travar a requisição
      EvolutionService.sendText(targetPhone, message)
        .then(() => console.log('📨 Código enviado via WhatsApp para', targetPhone))
        .catch(err => console.error('❌ Falha no envio do WhatsApp:', err));

      console.log('🔑 CÓDIGO DE RECUPERAÇÃO GERADO (Backup):', code, 'para', targetPhone);

      res.json({ message: 'Code sent successfully' });
    } catch (error) {
      console.error('❌ Erro no AuthController.requestPasswordReset:', error);
      next(error);
    }
  }

  /**
   * Redefine a senha usando o código
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number, code, new_password } = req.body;

      if (!phone_number || !code || !new_password) {
        return res.status(400).json({ error: 'Phone, code and new password are required' });
      }

      // Buscar o usuário para garantir que estamos usando o telefone correto
      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const stored = resetCodes.get(user.phone_number);

      if (!stored) {
        return res.status(400).json({ error: 'No reset request found or expired' });
      }

      if (Date.now() > stored.expires) {
        resetCodes.delete(user.phone_number);
        return res.status(400).json({ error: 'Code expired' });
      }

      if (stored.code !== code) {
        return res.status(400).json({ error: 'Invalid code' });
      }

      if (new_password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const new_password_hash = await bcrypt.hash(new_password, 10);

      await prisma.users.update({
        where: { id: user.id }, 
        data: { password_hash: new_password_hash }
      });

      // Limpar código usado
      resetCodes.delete(user.phone_number);

      console.log('✅ Senha redefinida com sucesso para:', user.phone_number);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('❌ Erro no AuthController.resetPassword:', error);
      next(error);
    }
  }

  /**
   * Cria um novo usuário (Apenas Admin)
   */
  static async createUser(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const accountId = req.accountId!;
      const { name, phone_number, email } = req.body;

      if (!name || !phone_number) {
        return res.status(400).json({ error: 'Name and phone number are required' });
      }

      const existingUser = await prisma.users.findUnique({
        where: { phone_number }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with this phone number' });
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
          user_id: user.id,
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

  /**
   * Define a senha no primeiro acesso
   */
  static async createPassword(req: Request, res: Response, next: NextFunction) {
   
    try {
      const { phone_number, password } = req.body;

      if (!phone_number || !password) {
        return res.status(400).json({ error: 'Phone number and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.password_hash) {
        return res.status(400).json({ error: 'Password already set' });
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

      const token = generateToken({
        userId: updatedUser.id,
        accountId: updatedUser.account_id,
        userRole: updatedUser.role ?? 'user'
      });

      console.log('✅ Senha criada e token gerado para:', phone_number);
      res.json({ user: updatedUser, token });
    } catch (error) {
      console.error('❌ Erro no AuthController.createPassword:', error);
      next(error);
    }
  }

  /**
   * Helper para encontrar usuário buscando por telefone com ou sem o 9º dígito
   */
  private static async findUserByPhone(phoneNumber: string) {
    // Remove caracteres não numéricos
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Se não tiver comprimento mínimo para ser celular BR com DDD, busca exato
    if (cleanPhone.length < 10) {
      return prisma.users.findUnique({ where: { phone_number: phoneNumber } });
    }

    
    //  duas variações possíveis para buscar no banco
    let phoneVariations: string[] = [phoneNumber]; // Busca exata original
    
    // Tenta normalizar removendo DDI 55 se existir para manipular
    let localNumber = cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone;
    
    if (localNumber.length === 11) {
      // Tem 9 dígitos (DDD + 9xxxx-xxxx)
      // Variação: remover o 9 (índice 2, pois 0 e 1 são DDD)
      const withoutNine = '55' + localNumber.substring(0, 2) + localNumber.substring(3);
      phoneVariations.push(withoutNine);
    } else if (localNumber.length === 10) {
      // Tem 8 dígitos (DDD + xxxx-xxxx)
      // Variação: adicionar o 9 após o DDD
      const withNine = '55' + localNumber.substring(0, 2) + '9' + localNumber.substring(2);
      phoneVariations.push(withNine);
    }

    console.log('🔍 Buscando usuário com variações de telefone:', phoneVariations);

    // Busca o primeiro usuário que der match em qualquer variação
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

  /**
   * Retorna os dados do usuário atual
   */
  static async me(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
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
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('❌ Erro no AuthController.me:', error);
      next(error);
    }
  }

  /**
   * Realiza o login do usuário
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { phone_number, password } = req.body;

      if (!phone_number || !password) {
        return res.status(400).json({ error: 'Phone number and password are required' });
      }

      const user = await AuthController.findUserByPhone(phone_number);

      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials or password not set' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ error: 'User account is not active' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({
        userId: user.id,
        accountId: user.account_id,
        userRole: user.role ?? 'user'
      });

      // Remove password_hash antes de enviar
      const { password_hash, ...userWithoutPassword } = user;

      console.log('✅ Login realizado com sucesso:', phone_number);
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error('❌ Erro no AuthController.login:', error);
      next(error);
    }
  }

  /**
   * Altera a senha de um usuário autenticado
   */
  static async changePassword(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const userId = req.userId!;
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        return res.status(400).json({ error: 'Old and new passwords are required' });
      }

      if (new_password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { id: true, password_hash: true }
      });

      if (!user || !user.password_hash) {
        return res.status(404).json({ error: 'User not found or password not set' });
      }

      const isPasswordValid = await bcrypt.compare(old_password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid old password' });
      }

      const new_password_hash = await bcrypt.hash(new_password, 10);

      await prisma.users.update({
        where: { id: userId },
        data: { password_hash: new_password_hash }
      });

      console.log('✅ Senha alterada com sucesso para o usuário:', userId);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('❌ Erro no AuthController.changePassword:', error);
      next(error);
    }
  }

  /**
   * Lista todos os usuários (Apenas Admin)
   */
  static async listUsers(req: JwtRequest, res: Response, next: NextFunction) {

    try {
      const accountId = req.accountId!;

      const users = await prisma.users.findMany({
        where: { 
          account_id: accountId,
          status: 'active' // Apenas usuários ativos
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

  /**
   * Atualiza dados de um usuário (Apenas Admin)
   */
  static async updateUser(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const accountId = req.accountId!;
      const { id } = req.params;
      const { name, email, role, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Verifica se o usuário pertence à mesma conta
      const existingUser = await prisma.users.findFirst({
        where: { id: Number(id), account_id: accountId }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
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

  /**
   * Exclusão lógica de um usuário (Apenas Admin)
   */
  static async deleteUser(req: JwtRequest, res: Response, next: NextFunction) {
    
    try {
      const accountId = req.accountId!;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Verifica se o usuário pertence à mesma conta
      const existingUser = await prisma.users.findFirst({
        where: { id: Number(id), account_id: accountId }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Não permite que o admin se delete (opcional, mas seguro)
      if (Number(id) === req.userId) {
        return res.status(400).json({ error: 'Cannot delete your own admin account' });
      }

      await prisma.users.update({
        where: { id: Number(id) },
        data: { status: 'inactive' }
      });

      console.log('✅ Usuário desativado com sucesso:', id);
      res.json({ message: 'User deleted (deactivated) successfully' });
    } catch (error) {
      console.error('❌ Erro no AuthController.deleteUser:', error);
      next(error);
    }
  }
}