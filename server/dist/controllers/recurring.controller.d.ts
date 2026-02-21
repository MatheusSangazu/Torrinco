import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class RecurringController {
    /**
     * Cria uma nova transação recorrente
     */
    static createTransaction(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista transações recorrentes
     */
    static listTransactions(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Atualiza uma transação recorrente
     */
    static updateTransaction(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Remove (cancela) uma transação recorrente
     */
    static deleteTransaction(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Gera uma transação real a partir de uma recorrente
     */
    static generateTransaction(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista transações recorrentes próximas do vencimento
     */
    static listDue(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=recurring.controller.d.ts.map