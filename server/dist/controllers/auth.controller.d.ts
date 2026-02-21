import type { Request, Response, NextFunction } from 'express';
import { type JwtRequest } from '../middleware/jwt.js';
export declare class AuthController {
    /**
     * Solicita redefinição de senha (Gera código)
     */
    static requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Redefine a senha usando o código
     */
    static resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Cria um novo usuário (Apenas Admin)
     */
    static createUser(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Define a senha no primeiro acesso
     */
    static createPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Helper para encontrar usuário buscando por telefone com ou sem o 9º dígito
     */
    private static findUserByPhone;
    /**
     * Retorna os dados do usuário atual (Me)
     */
    static me(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Realiza o login do usuário
     */
    static login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Altera a senha de um usuário autenticado
     */
    static changePassword(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista todos os usuários (Apenas Admin)
     */
    static listUsers(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Atualiza dados de um usuário (Apenas Admin)
     */
    static updateUser(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Exclusão lógica de um usuário (Apenas Admin)
     */
    static deleteUser(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=auth.controller.d.ts.map