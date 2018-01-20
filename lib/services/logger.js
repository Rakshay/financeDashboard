import winston from 'winston';

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 50,
      colorize: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message){
    logger.info(message);
  }
};

export default logger;