import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class CardsController {
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Cria um novo cartão de crédito
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza um cartão
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    static getBillHistory(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Remove um cartão
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=cards.controller.d.ts.map