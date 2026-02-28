import express, {} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
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
process.env.TZ = 'America/Sao_Paulo';
const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
// --- HTTPS Enforcement (Apenas em produção) ---
if (isProduction) {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            return res.redirect(`https://${req.header('host')}${req.url}`);
        }
        next();
    });
}
// --- Middlewares Globais ---
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://torrinco.forjacorp.com',
    'http://torrinco.forjacorp.com',
    'https://apitorrinco.forjacorp.com',
    'http://apitorrinco.forjacorp.com'
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: isProduction ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    } : false,
    crossOriginEmbedderPolicy: false
}));
app.use(express.json());
// --- Rotas ---
// Rota de Saúde / Info
app.get('/', (req, res) => {
    res.json({
        message: 'Torrinco API',
        status: 'online',
        version: '1.0.0'
    });
});
// Health Check para Coolify
app.get('/health', async (req, res) => {
    try {
        const { prisma } = await import('./lib/prisma.js');
        await prisma.$queryRaw `SELECT 1`;
        res.json({ status: 'healthy', database: 'connected' });
    }
    catch (error) {
        res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
    }
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