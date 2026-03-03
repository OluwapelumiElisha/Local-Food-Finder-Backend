import mongoose from 'mongoose';
import logger from './logger';
import { envConfig } from './env';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const message = (error as Error).message;
    logger.error(`MongoDB connection error: ${message}`);
    console.error(`MongoDB connection error: ${message}`);
    process.exit(1); 
  }
};

export default connectDB;
