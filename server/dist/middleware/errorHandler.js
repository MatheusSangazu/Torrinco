export const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Record already exists' });
    }
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found' });
    }
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};
//# sourceMappingURL=errorHandler.js.map