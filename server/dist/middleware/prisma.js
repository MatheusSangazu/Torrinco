import { prisma } from '../lib/prisma.js';
export const prismaMiddleware = (req, res, next) => {
    req.prisma = prisma;
    next();
};
export default prisma;
//# sourceMappingURL=prisma.js.map