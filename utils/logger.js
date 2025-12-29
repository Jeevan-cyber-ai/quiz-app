const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // 1. Audit Log: For Illegal activities/Security alerts
        new winston.transports.File({ 
            filename: path.join('logs', 'audit.log'), 
            level: 'warn' 
        }),
        // 2. Combined Log: For general app flow
        new winston.transports.File({ 
            filename: path.join('logs', 'combined.log') 
        }),
        // 3. Error Log: For system crashes/exceptions
        new winston.transports.File({ 
            filename: path.join('logs', 'error.log'), 
            level: 'error' 
        })
    ],
});

// Also log to console if not in production
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger;