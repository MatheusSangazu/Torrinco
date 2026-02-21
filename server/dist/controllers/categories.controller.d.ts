import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class CategoriesController {
    /**
     * Lista todas as categorias do usuário
     */
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Cria uma nova categoria
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza uma categoria
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Remove uma categoria
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=categories.controller.d.ts.map