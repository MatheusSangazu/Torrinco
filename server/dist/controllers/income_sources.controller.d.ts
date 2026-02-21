import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class IncomeSourcesController {
    /**
     * Lista todas as fontes de receita do usuário
     */
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Cria uma nova fonte de receita
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza uma fonte de receita
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Remove uma fonte de receita
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=income_sources.controller.d.ts.map