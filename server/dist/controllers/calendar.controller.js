import { prisma } from '../lib/prisma.js';
export class CalendarController {
    /**
     * Cria um novo evento no calendário
     */
    static async create(req, res, next) {
        try {
            const { title, event_date, description, google_event_id } = req.body;
            const userId = req.userId;
            if (!title || !event_date) {
                return res.status(400).json({ error: 'Title and event_date are required' });
            }
            const event = await prisma.events.create({
                data: {
                    user_id: userId,
                    title,
                    event_date: new Date(event_date),
                    description,
                    google_event_id
                }
            });
            res.status(201).json({ event });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Lista eventos com filtro de data
     */
    static async list(req, res, next) {
        try {
            const { start_date, end_date } = req.query;
            const userId = req.userId;
            const where = { user_id: userId };
            if (start_date || end_date) {
                where.event_date = {};
                if (start_date)
                    where.event_date.gte = new Date(start_date);
                if (end_date)
                    where.event_date.lte = new Date(end_date);
            }
            const events = await prisma.events.findMany({
                where,
                orderBy: {
                    event_date: 'asc'
                }
            });
            res.json({ events });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém um evento específico
     */
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const event = await prisma.events.findFirst({
                where: {
                    id: Number(id),
                    user_id: userId
                }
            });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json({ event });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Atualiza um evento
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, event_date, description, google_event_id } = req.body;
            const userId = req.userId;
            const existingEvent = await prisma.events.findFirst({
                where: { id: Number(id), user_id: userId }
            });
            if (!existingEvent) {
                return res.status(404).json({ error: 'Event not found' });
            }
            const event = await prisma.events.update({
                where: { id: Number(id) },
                data: {
                    title: title ?? undefined,
                    event_date: event_date ? new Date(event_date) : undefined,
                    description: description ?? undefined,
                    google_event_id: google_event_id ?? undefined
                }
            });
            res.json({ event });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove um evento
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const existingEvent = await prisma.events.findFirst({
                where: { id: Number(id), user_id: userId }
            });
            if (!existingEvent) {
                return res.status(404).json({ error: 'Event not found' });
            }
            await prisma.events.delete({
                where: { id: Number(id) }
            });
            res.json({ message: 'Event deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=calendar.controller.js.map