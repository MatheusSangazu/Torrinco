import express, {} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prismaMiddleware } from './middleware/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
// Rotas
import authRoutes from './routes/auth.routes.js';
import financeRoutes from './routes/finance.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import entitiesRoutes from './routes/entities.routes.js';
import recurringRoutes from './routes/recurring.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import remindersRoutes from './routes/reminders.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import exportRoutes from './routes/export.routes.js';
import cardsRoutes from './routes/cards.routes.js';
import incomeSourcesRoutes from './routes/income_sources.routes.js';
import installmentsRoutes from './routes/installments.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());
// Logging de Requisições
app.use((req, res, next) => {
    console.log(`📥 [EXPRESS LOG] ${req.method} ${req.url}`);
    next();
});
// Injeção do Prisma no Request (opcional, mas mantido por compatibilidade)
app.use((req, res, next) => {
    console.log('🔧 [PRISMA MIDDLEWARE] Injetando Prisma no Request');
    prismaMiddleware(req, res, next);
});
// --- Rotas ---
// Rota de Saúde / Info
app.get('/', (req, res) => {
    res.json({
        message: 'Torrinco API',
        status: 'online',
        version: '1.0.0'
    });
});
//// Registro de Módulos
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/entities', entitiesRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/income-sources', incomeSourcesRoutes);
app.use('/api/installments', installmentsRoutes);
// --- Tratamento de Erros ---
app.use(errorHandler);
// --- Inicialização do Servidor ---
const startServer = async () => {
    try {
        const { prisma } = await import('./lib/prisma.js');
        await prisma.$connect();
        console.log('✅ Conectado ao banco de dados (Prisma)');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`🆔 PID do Processo: ${process.pid}`);
        });
    }
    catch (error) {
        console.error('❌ Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map