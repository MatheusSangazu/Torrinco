import { prisma } from '../lib/prisma.js';
export class CategoriesController {
    /**
     * Lista todas as categorias do usuário
     */
    static async list(req, res, next) {
        try {
            const userId = req.userId;
            const { type } = req.query;
            const where = { user_id: userId };
            if (type)
                where.type = type;
            const categories = await prisma.categories.findMany({
                where,
                orderBy: { name: 'asc' }
            });
            res.json({ categories });
        }
        catch (error) {
            console.error('❌ Erro no CategoriesController.list:', error);
            next(error);
        }
    }
    /**
     * Cria uma nova categoria
     */
    static async create(req, res, next) {
        try {
            const userId = req.userId;
            const { name, type, color } = req.body;
            if (!name || !type) {
                return res.status(400).json({ error: 'Name and type are required' });
            }
            // Check if already exists
            const existing = await prisma.categories.findFirst({
                where: {
                    user_id: userId,
                    name,
                    type
                }
            });
            if (existing) {
                return res.status(409).json({ error: 'Category already exists for this type' });
            }
            const category = await prisma.categories.create({
                data: {
                    user_id: userId,
                    name,
                    type,
                    color: color || '#3b82f6' // Default blue
                }
            });
            res.status(201).json({ category });
        }
        catch (error) {
            console.error('❌ Erro no CategoriesController.create:', error);
            next(error);
        }
    }
    /**
     * Atualiza uma categoria
     */
    static async update(req, res, next) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { name, color } = req.body;
            const category = await prisma.categories.findUnique({
                where: { id: Number(id) }
            });
            if (!category || category.user_id !== userId) {
                return res.status(404).json({ error: 'Category not found' });
            }
            const updated = await prisma.categories.update({
                where: { id: Number(id) },
                data: {
                    name: name || undefined,
                    color: color || undefined
                }
            });
            res.json({ category: updated });
        }
        catch (error) {
            console.error('❌ Erro no CategoriesController.update:', error);
            next(error);
        }
    }
    /**
     * Remove uma categoria
     */
    static async delete(req, res, next) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const category = await prisma.categories.findUnique({
                where: { id: Number(id) }
            });
            if (!category || category.user_id !== userId) {
                return res.status(404).json({ error: 'Category not found' });
            }
            await prisma.categories.delete({
                where: { id: Number(id) }
            });
            res.status(204).send();
        }
        catch (error) {
            console.error('❌ Erro no CategoriesController.delete:', error);
            next(error);
        }
    }
}
//# sourceMappingURL=categories.controller.js.map