import { prisma } from '../lib/prisma.js';
export class BudgetController {
    static async upsert(req, res, next) {
        try {
            const { category, amount_limit, month_ref } = req.body;
            const userId = req.userId;
            if (!category || !amount_limit) {
                return res.status(400).json({ error: 'Category and amount_limit are required' });
            }
            const budget = await prisma.budgets.upsert({
                where: {
                    user_id_category: {
                        user_id: userId,
                        category
                    }
                },
                update: {
                    amount_limit: parseFloat(amount_limit),
                    month_ref: month_ref || new Date().toISOString().slice(0, 7)
                },
                create: {
                    user_id: userId,
                    category,
                    amount_limit: parseFloat(amount_limit),
                    month_ref: month_ref || new Date().toISOString().slice(0, 7)
                }
            });
            res.status(201).json({ budget });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Lista orçamentos com progresso de gastos
     */
    static async list(req, res, next) {
        try {
            const { month_ref } = req.query;
            const userId = req.userId;
            const where = { user_id: userId };
            if (month_ref)
                where.month_ref = month_ref;
            const budgets = await prisma.budgets.findMany({
                where,
                orderBy: {
                    category: 'asc'
                }
            });
            const budgetsWithProgress = await Promise.all(budgets.map(async (budget) => {
                const [startDate, endDate] = month_ref
                    ? [`${month_ref}-01`, `${month_ref}-31`]
                    : [`${new Date().toISOString().slice(0, 7)}-01`, `${new Date().toISOString().slice(0, 7)}-31`];
                const spent = await prisma.transactions.aggregate({
                    where: {
                        user_id: userId,
                        category: budget.category,
                        type: 'expense',
                        transaction_date: {
                            gte: new Date(startDate),
                            lte: new Date(endDate)
                        },
                        deleted_at: null
                    },
                    _sum: {
                        amount: true
                    }
                });
                const spentAmount = spent._sum.amount ? parseFloat(spent._sum.amount.toString()) : 0;
                const remaining = parseFloat(budget.amount_limit.toString()) - spentAmount;
                const percentage = (spentAmount / parseFloat(budget.amount_limit.toString())) * 100;
                return {
                    ...budget,
                    spent: spentAmount,
                    remaining,
                    percentage: Math.min(percentage, 100)
                };
            }));
            res.json({ budgets: budgetsWithProgress });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove um orçamento
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const existingBudget = await prisma.budgets.findFirst({
                where: { id: Number(id), user_id: userId }
            });
            if (!existingBudget) {
                return res.status(404).json({ error: 'Budget not found' });
            }
            await prisma.budgets.delete({
                where: { id: Number(id) }
            });
            res.json({ message: 'Budget deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=budget.controller.js.map