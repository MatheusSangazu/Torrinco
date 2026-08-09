import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJwt, requireAdmin } from '../middleware/jwt.js';
import { authLimiter, passwordResetLimiter, firstAccessLimiter } from '../middleware/rate-limiter.js';
import { validate } from '../middleware/validate.js';
import { authSchemas, commonSchemas } from '../schemas/index.js';

const router = Router();

console.log('️  Registrando rotas em auth.routes.ts');

// Rotas públicas de recuperação de senha (com rate limiting)
router.post('/request-password-reset', passwordResetLimiter, validate({ body: authSchemas.requestPasswordReset }), AuthController.requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, validate({ body: authSchemas.resetPassword }), AuthController.resetPassword);

// Rotas públicas de primeiro acesso (com rate limiting)
router.post('/request-first-access-code', firstAccessLimiter, validate({ body: authSchemas.requestFirstAccessCode }), AuthController.requestFirstAccessCode);
router.post('/validate-first-access-code', firstAccessLimiter, validate({ body: authSchemas.validateFirstAccessCode }), AuthController.validateFirstAccessCode);
router.post('/create-password', firstAccessLimiter, validate({ body: authSchemas.createPassword }), AuthController.createPassword);

// Rota de Login (com rate limiting)
router.post('/login', authLimiter, validate({ body: authSchemas.login }), AuthController.login);

// Rota de Usuário Logado
router.get('/me', authenticateJwt, AuthController.me);

// Rota para alterar senha (Requer estar logado)
router.post('/change-password', authenticateJwt, validate({ body: authSchemas.changePassword }), AuthController.changePassword);

// Rota para refresh token (cookie HttpOnly, sem necessidade de body)
router.post('/refresh-token', AuthController.refreshToken);

// Rota para logout (não exige JWT — pode ler cookie mesmo com access token expirado)
router.post('/logout', AuthController.logout);

// Rotas protegidas (Apenas Admin)
router.post('/create-user', authenticateJwt, requireAdmin, validate({ body: authSchemas.createUser }), AuthController.createUser);
router.get('/users', authenticateJwt, requireAdmin, AuthController.listUsers);
router.put('/users/:id', authenticateJwt, requireAdmin, validate({ params: commonSchemas.idParams, body: authSchemas.updateUser }), AuthController.updateUser);
router.delete('/users/:id', authenticateJwt, requireAdmin, validate({ params: commonSchemas.idParams }), AuthController.deleteUser);

export default router;
