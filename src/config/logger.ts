import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(), // JSON for file
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Pretty console logs in dev
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.prettyPrint()
    )
  }));
}

export default logger;
