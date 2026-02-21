import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJwt, requireAdmin } from '../middleware/jwt.js';

const router = Router();

console.log('️  Registrando rotas em auth.routes.ts');

// Rotas públicas de recuperação de senha
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);

// Rota pública para definir senha no primeiro acesso
router.post('/create-password', AuthController.createPassword);

// Rota de Login
router.post('/login', AuthController.login);

// Rota de Usuário Logado
router.get('/me', authenticateJwt, AuthController.me);

// Rota para alterar senha (Requer estar logado)
router.post('/change-password', authenticateJwt, AuthController.changePassword);

// Rotas protegidas (Apenas Admin)
router.post('/create-user', authenticateJwt, requireAdmin, AuthController.createUser);
router.get('/users', authenticateJwt, requireAdmin, AuthController.listUsers);
router.put('/users/:id', authenticateJwt, requireAdmin, AuthController.updateUser);
router.delete('/users/:id', authenticateJwt, requireAdmin, AuthController.deleteUser);

export default router;