const { EventEmitter } = require('events');

const logEmitter = new EventEmitter();

// Middleware to intercept and broadcast API requests
const logMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    let type = 'info';
    
    if (res.statusCode >= 400 && res.statusCode < 500) type = 'warning';
    if (res.statusCode >= 500) type = 'error';

    const event = `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
    const time = new Date().toISOString().split('T')[1].slice(0, 8); // HH:MM:SS
    
    logEmitter.emit('log', { time, type, event });
  });

  next();
};

module.exports = {
  logEmitter,
  logMiddleware
};
