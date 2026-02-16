import mongoose from 'mongoose';
import logger from './logger';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${(error as Error).message}`);
    process.exit(1); 
  }
};

export default connectDB;