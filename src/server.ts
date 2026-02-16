import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import logger from './config/logger';
import connectDB from './config/db';
import routes from "./routes/index"
import { notFound } from "./middlewares/not-found"
import { setupSwagger } from './swagger';

dotenv.config();

// const app: Application = express();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev')); // Logs requests to the console

connectDB()

app.use("/api", routes);

// Sample Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to UI/LAUTECH Local Food Finder API');
});

setupSwagger(app);


app.use(notFound);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});