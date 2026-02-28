import type { Response, NextFunction } from 'express';
import type { JwtRequest } from '../middleware/jwt.js';
export declare class FinanceController {
    /**
     * Projeção de transações recorrentes
     */
    private static projectRecurringTransactions;
    /**
     * Cria uma nova transação
     */
    static create(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Lista transações com filtros
     */
    static list(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Obtém uma transação específica
     */
    static getById(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Atualiza uma transação
     */
    static update(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Exclusão lógica de uma transação
     */
    static delete(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Obtém resumo financeiro (Dashboard)
     */
    static getSummary(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    static getForecast(req: JwtRequest, res: Response, next: NextFunction): Promise<void>;
    static getCardBill(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getCardNextBill(req: JwtRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=finance.controller.d.ts.map