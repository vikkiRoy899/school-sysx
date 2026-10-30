import logger from '../utils/logger.js';
export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    logger.error(`Error processing ${req.method} ${req.path}: ${err.message}`, {
        stack: err.stack,
        body: req.body,
    });
    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        path: req.path,
        method: req.method,
    });
}
//# sourceMappingURL=errorHandler.js.map