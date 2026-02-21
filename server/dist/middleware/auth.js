export const authenticateUser = (req, res, next) => {
    const phoneNumber = req.headers['x-phone-number'];
    if (!phoneNumber) {
        return res.status(401).json({ error: 'Phone number required' });
    }
    const prisma = req.prisma;
    prisma.users.findUnique({
        where: { phone_number: phoneNumber }
    }).then((users) => {
        if (!users) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (users.status !== 'active') {
            return res.status(403).json({ error: 'User account is not active' });
        }
        req.userId = users.id;
        req.accountId = users.account_id;
        req.userRole = users.role;
        next();
    }).catch((error) => {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    });
};
export const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
//# sourceMappingURL=auth.js.map