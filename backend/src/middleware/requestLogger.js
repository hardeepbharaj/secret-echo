const morgan = require('morgan');
const { logger } = require('../utils/logger');

// Create a custom stream for morgan that uses our winston logger
const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Create custom morgan token for request body
morgan.token('body', (req) => {
  const body = { ...req.body };
  
  // Remove sensitive information
  if (body.password) body.password = '********';
  if (body.token) body.token = '********';
  
  return JSON.stringify(body);
});

// Create custom morgan token for response body
morgan.token('response-body', (req, res) => {
  const body = res.__custom_body;
  
  if (!body) return '';
  
  // Remove sensitive information
  if (body.token) body.token = '********';
  if (body.data?.user?.password) body.data.user.password = '********';
  
  return JSON.stringify(body);
});

// Middleware to capture response body
const captureResponseBody = (req, res, next) => {
  const oldSend = res.send;
  
  res.send = function(data) {
    res.__custom_body = JSON.parse(data);
    return oldSend.apply(res, arguments);
  };
  
  next();
};

// Create request logger middleware
const requestLogger = morgan(
  // Log format
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms REQUEST: :body RESPONSE: :response-body',
  {
    stream,
    skip: (req) => {
      // Skip logging for health check endpoints
      return req.url === '/health' || req.url === '/ping';
    }
  }
);

module.exports = {
  requestLogger,
  captureResponseBody
}; 