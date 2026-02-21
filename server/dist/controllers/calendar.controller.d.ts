import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class CalendarController {
    /**
     * Cria um novo evento no calendário
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista eventos com filtro de data
     */
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém um evento específico
     */
    static getById(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza um evento
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Remove um evento
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=calendar.controller.d.ts.map