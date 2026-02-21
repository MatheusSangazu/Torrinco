import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class InstallmentsController {
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    static getById(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static cancel(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateStatus(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=installments.controller.d.ts.map