const { createLogger, format, transports } =require('winston');

const DATE_FORMATE= {
    TIMESTAMP : 'YYYY-MM-DD HH:mm:ss',
    DATE_PATTERN : 'YYYY-MM-DD'
};

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  silly: 6,
};

const transportsClone = transports;

const config = {
  levels: logLevels,
  format: format.combine(
    format.timestamp({
      format: DATE_FORMATE.TIMESTAMP,
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  exitOnError: false,
  transports: [
    new transportsClone.Console({
      level: process.env.LOGGER_LEVEL || 'silly',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
};

 const logger = createLogger(config);
 module.exports ={logger}
