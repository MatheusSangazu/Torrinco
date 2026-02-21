import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class EntityController {
    /**
     * Cria uma nova entidade financeira
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista todas as entidades do usuário
     */
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém uma entidade específica
     */
    static getById(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza uma entidade
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Remove uma entidade
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=entity.controller.d.ts.map