const winston = require('winston');

const disableLog = process.env.NODE_ENV === 'test' && !process.env.AUTH_EXAMPLE_LOGLEVEL;
const logLevel = process.env.AUTH_EXAMPLE_LOGLEVEL || 'info';
const prettyLog = !process.env.AUTH_EXAMPLE_LOG_SIMPLE;

const logParams = {
  console: {
    level: logLevel,
    colorize: prettyLog,
    timestamp: true,
    prettyPrint: prettyLog,
    humanReadableUnhandledException: true
  }
};

const log = winston.loggers.add('auth_example', logParams);

if (disableLog) {
  winston.loggers.get('auth_example').remove(winston.transports.Console);
}

module.exports = log;
