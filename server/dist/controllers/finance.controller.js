import { prisma } from '../lib/prisma.js';
export class FinanceController {
    /**
     * Cria uma nova transação
     */
    static async create(req, res, next) {
        try {
            const { amount, type, category, category_id, income_source_id, description, transaction_date, status, entity_id, is_recurring, payment_method } = req.body;
            const userId = req.userId;
            const accountId = req.accountId;
            if (!amount || !type || !transaction_date) {
                return res.status(400).json({ error: 'Amount, type and transaction_date are required' });
            }
            if (!['expense', 'income'].includes(type)) {
                return res.status(400).json({ error: 'Type must be expense or income' });
            }
            // Resolver category_id
            let finalCategoryId = category_id ? Number(category_id) : null;
            let finalCategoryName = category;
            // Se não veio ID mas veio nome, tentar encontrar ou criar
            if (!finalCategoryId && category) {
                const existingCategory = await prisma.categories.findFirst({
                    where: {
                        user_id: userId,
                        name: category,
                        type
                    }
                });
                if (existingCategory) {
                    finalCategoryId = existingCategory.id;
                }
                else {
                    // Criar nova categoria automaticamente
                    const newCategory = await prisma.categories.create({
                        data: {
                            user_id: userId,
                            name: category,
                            type,
                            color: type === 'income' ? '#22c55e' : '#ef4444'
                        }
                    });
                    finalCategoryId = newCategory.id;
                }
            }
            else if (finalCategoryId) {
                // Se veio ID, buscar o nome para preencher o campo legado
                const cat = await prisma.categories.findUnique({
                    where: { id: finalCategoryId }
                });
                if (cat) {
                    finalCategoryName = cat.name;
                }
            }
            // Resolver income_source_id
            let finalIncomeSourceId = income_source_id ? Number(income_source_id) : null;
            // Validar que income_source_id só pode ser usado com tipo 'income'
            if (finalIncomeSourceId && type !== 'income') {
                return res.status(400).json({ error: 'Income source can only be used with income type' });
            }
            // Validar que income_source_id existe e pertence ao usuário
            if (finalIncomeSourceId) {
                const incomeSource = await prisma.income_sources.findFirst({
                    where: {
                        id: finalIncomeSourceId,
                        user_id: userId
                    }
                });
                if (!incomeSource) {
                    return res.status(400).json({ error: 'Invalid income source' });
                }
            }
            const transaction = await prisma.transactions.create({
                data: {
                    account_id: accountId,
                    user_id: userId,
                    entity_id: entity_id ? Number(entity_id) : null,
                    amount: parseFloat(amount),
                    type,
                    category: finalCategoryName,
                    category_id: finalCategoryId,
                    income_source_id: finalIncomeSourceId,
                    description,
                    transaction_date: new Date(transaction_date),
                    status: status || 'paid',
                    is_recurring: is_recurring || false,
                    payment_method: payment_method || 'cash'
                },
                include: {
                    financial_entities: true,
                    categories: true,
                    income_sources: true
                }
            });
            res.status(201).json({ transaction });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Lista transações com filtros
     */
    static async list(req, res, next) {
        try {
            const { start_date, end_date, type, category, status } = req.query;
            const userId = req.userId;
            const where = {
                user_id: userId,
                deleted_at: null
            };
            if (start_date || end_date) {
                where.transaction_date = {};
                if (start_date)
                    where.transaction_date.gte = new Date(start_date);
                if (end_date)
                    where.transaction_date.lte = new Date(end_date);
            }
            if (type)
                where.type = type;
            if (category)
                where.category = category;
            if (status)
                where.status = status;
            const transactions = await prisma.transactions.findMany({
                where,
                include: {
                    financial_entities: true,
                    categories: true,
                    income_sources: true,
                    accounts: true
                },
                orderBy: {
                    transaction_date: 'desc'
                }
            });
            res.json({ transactions });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém uma transação específica
     */
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const transaction = await prisma.transactions.findFirst({
                where: {
                    id: Number(id),
                    user_id: userId,
                    deleted_at: null
                },
                include: {
                    financial_entities: true,
                    accounts: true,
                    income_sources: true
                }
            });
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            res.json({ transaction });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Atualiza uma transação
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { amount, type, category, category_id, income_source_id, description, transaction_date, status, entity_id, payment_method } = req.body;
            const userId = req.userId;
            const transaction = await prisma.transactions.findFirst({
                where: { id: Number(id), user_id: userId },
                include: {
                    financial_entities: true,
                    categories: true
                }
            });
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            // Validar income_source_id se fornecido
            let finalIncomeSourceId = income_source_id !== undefined ? (income_source_id ? Number(income_source_id) : null) : undefined;
            if (finalIncomeSourceId !== undefined) {
                // Validar que income_source_id só pode ser usado com tipo 'income'
                if (finalIncomeSourceId && (type && type !== 'income')) {
                    return res.status(400).json({ error: 'Income source can only be used with income type' });
                }
                // Validar que income_source_id existe e pertence ao usuário
                if (finalIncomeSourceId) {
                    const incomeSource = await prisma.income_sources.findFirst({
                        where: {
                            id: finalIncomeSourceId,
                            user_id: userId
                        }
                    });
                    if (!incomeSource) {
                        return res.status(400).json({ error: 'Invalid income source' });
                    }
                }
            }
            const updatedTransaction = await prisma.transactions.update({
                where: { id: Number(id) },
                data: {
                    amount: amount ? parseFloat(amount) : undefined,
                    type: type ?? undefined,
                    category: category ?? undefined,
                    income_source_id: finalIncomeSourceId !== undefined ? finalIncomeSourceId : undefined,
                    description: description ?? undefined,
                    transaction_date: transaction_date ? new Date(transaction_date) : undefined,
                    status: status ?? undefined,
                    entity_id: entity_id ? Number(entity_id) : undefined,
                    payment_method: payment_method ?? undefined
                },
                include: {
                    financial_entities: true,
                    categories: true,
                    income_sources: true
                }
            });
            res.json({ transaction: updatedTransaction });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Exclusão lógica de uma transação
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const existingTransaction = await prisma.transactions.findFirst({
                where: { id: Number(id), user_id: userId }
            });
            if (!existingTransaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            await prisma.transactions.update({
                where: { id: Number(id) },
                data: { deleted_at: new Date() }
            });
            res.json({ message: 'Transaction deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém resumo financeiro (Dashboard)
     */
    static async getSummary(req, res, next) {
        try {
            const userId = req.userId;
            const { period } = req.query;
            const now = new Date();
            let dateFilter = undefined;
            if (period === 'all') {
                dateFilter = undefined;
            }
            else {
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                lastDayOfMonth.setHours(23, 59, 59, 999);
                dateFilter = {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                };
            }
            const [income, expense, expenseCash] = await Promise.all([
                prisma.transactions.aggregate({
                    where: {
                        user_id: userId,
                        type: 'income',
                        transaction_date: dateFilter,
                        deleted_at: null
                    },
                    _sum: { amount: true }
                }),
                prisma.transactions.aggregate({
                    where: {
                        user_id: userId,
                        type: 'expense',
                        transaction_date: dateFilter,
                        deleted_at: null
                    },
                    _sum: { amount: true }
                }),
                prisma.transactions.aggregate({
                    where: {
                        user_id: userId,
                        type: 'expense',
                        payment_method: { in: ['cash', 'pix', 'debit'] },
                        transaction_date: dateFilter,
                        deleted_at: null
                    },
                    _sum: { amount: true }
                })
            ]);
            const cashBalance = (Number(income._sum.amount) || 0) - (Number(expenseCash._sum.amount) || 0);
            res.json({
                month_summary: {
                    income: income._sum.amount || 0,
                    expense: expense._sum.amount || 0,
                    balance: (Number(income._sum.amount) || 0) - (Number(expense._sum.amount) || 0),
                    cash_balance: cashBalance
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getForecast(req, res, next) {
        try {
            const userId = req.userId;
            const period = req.query.period || 'next_month';
            let dateFilter = {};
            if (period === 'next_month') {
                const today = new Date();
                const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                firstDayNextMonth.setHours(0, 0, 0, 0);
                lastDayNextMonth.setHours(23, 59, 59, 999);
                dateFilter = {
                    gte: firstDayNextMonth,
                    lte: lastDayNextMonth
                };
            }
            else if (period === 'month') {
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                firstDayOfMonth.setHours(0, 0, 0, 0);
                lastDayOfMonth.setHours(23, 59, 59, 999);
                dateFilter = {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                };
            }
            const today = new Date();
            const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
            const [recurringIncome, recurringExpenses] = await Promise.all([
                prisma.recurring_transactions.aggregate({
                    where: {
                        user_id: userId,
                        type: 'income',
                        status: 'active',
                        next_due_date: {
                            gte: firstDayNextMonth,
                            lte: lastDayNextMonth
                        }
                    },
                    _sum: { amount: true },
                    _count: true
                }),
                prisma.recurring_transactions.aggregate({
                    where: {
                        user_id: userId,
                        type: 'expense',
                        status: 'active',
                        next_due_date: {
                            gte: firstDayNextMonth,
                            lte: lastDayNextMonth
                        }
                    },
                    _sum: { amount: true },
                    _count: true
                })
            ]);
            const forecastIncome = Number(recurringIncome._sum.amount) || 0;
            const forecastExpenses = Number(recurringExpenses._sum.amount) || 0;
            const forecastBalance = forecastIncome - forecastExpenses;
            const [recurringIncomeList, recurringExpenseList] = await Promise.all([
                prisma.recurring_transactions.findMany({
                    where: {
                        user_id: userId,
                        type: 'income',
                        status: 'active',
                        next_due_date: {
                            gte: firstDayNextMonth,
                            lte: lastDayNextMonth
                        }
                    },
                    select: {
                        description: true,
                        amount: true,
                        next_due_date: true
                    }
                }),
                prisma.recurring_transactions.findMany({
                    where: {
                        user_id: userId,
                        type: 'expense',
                        status: 'active',
                        next_due_date: {
                            gte: firstDayNextMonth,
                            lte: lastDayNextMonth
                        }
                    },
                    select: {
                        description: true,
                        amount: true,
                        next_due_date: true
                    }
                })
            ]);
            res.json({
                period: period === 'next_month' ? 'Próximo Mês' : 'Mês Atual',
                forecast: {
                    income: forecastIncome,
                    expenses: forecastExpenses,
                    balance: forecastBalance,
                    breakdown: {
                        recurring_income: recurringIncomeList,
                        recurring_expenses: recurringExpenseList
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=finance.controller.js.map