const winston = require('winston');
const { format } = winston;
const path = require('path');

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Add colors to winston
winston.addColors(colors);

// Custom format for error objects
const errorFormat = format((info) => {
  if (info.error && info.error instanceof Error) {
    info.message = `${info.message}: ${info.error.message}`;
    info.stack = info.error.stack;
  }
  return info;
})();

// Define which transports the logger must use to print out messages
const transports = [
  // Console transport for all logs
  new winston.transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          return `${timestamp} ${level}: ${message}\n${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
      })
    )
  }),
  
  // File transport for error logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: format.combine(
      format.timestamp(),
      format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log'),
    format: format.combine(
      format.timestamp(),
      format.json()
    )
  })
];

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: format.combine(
    errorFormat,
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss:ms'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'secret-echo' },
  transports
});

// Create a stream object with a write function that will be used by morgan
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = {
  logger,
  stream,
}; 