import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class ExportController {
    static exportToExcel(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    static sendReportToWhatsApp(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=export.controller.d.ts.map