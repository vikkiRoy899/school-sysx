import winston from 'winston';
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
    defaultMeta: { service: 'school-coaching-backend' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)),
        }),
    ],
});
export default logger;
//# sourceMappingURL=logger.js.map