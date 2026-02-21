import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class ReminderController {
    /**
     * Cria um novo lembrete
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista lembretes do usuário
     */
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém um lembrete por ID
     */
    static getById(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza um lembrete
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Marca um lembrete como concluído
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Cria um log de lembrete
     */
    static createLog(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista logs de lembretes
     */
    static listLogs(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Lista lembretes vencidos ou para o momento atual
     */
    static listDue(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=reminder.controller.d.ts.map