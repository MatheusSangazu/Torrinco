import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJwt, requireAdmin } from '../middleware/jwt.js';
import { authLimiter, passwordResetLimiter, firstAccessLimiter } from '../middleware/rate-limiter.js';
const router = Router();
console.log('️  Registrando rotas em auth.routes.ts');
// Rotas públicas de recuperação de senha (com rate limiting)
router.post('/request-password-reset', passwordResetLimiter, AuthController.requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, AuthController.resetPassword);
// Rotas públicas de primeiro acesso (com rate limiting)
router.post('/request-first-access-code', firstAccessLimiter, AuthController.requestFirstAccessCode);
router.post('/validate-first-access-code', firstAccessLimiter, AuthController.validateFirstAccessCode);
router.post('/create-password', firstAccessLimiter, AuthController.createPassword);
// Rota de Login (com rate limiting)
router.post('/login', authLimiter, AuthController.login);
// Rota de Usuário Logado
router.get('/me', authenticateJwt, AuthController.me);
// Rota para alterar senha (Requer estar logado)
router.post('/change-password', authenticateJwt, AuthController.changePassword);
// Rota para refresh token
router.post('/refresh-token', AuthController.refreshToken);
// Rota para logout (Requer estar logado)
router.post('/logout', authenticateJwt, AuthController.logout);
// Rotas protegidas (Apenas Admin)
router.post('/create-user', authenticateJwt, requireAdmin, AuthController.createUser);
router.get('/users', authenticateJwt, requireAdmin, AuthController.listUsers);
router.put('/users/:id', authenticateJwt, requireAdmin, AuthController.updateUser);
router.delete('/users/:id', authenticateJwt, requireAdmin, AuthController.deleteUser);
export default router;
//# sourceMappingURL=auth.routes.js.map