import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import logger from './config/logger';
import connectDB from './config/db';
import routes from "./routes/index";
import { notFound } from "./middlewares/not-found";
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/*
|--------------------------------------------------------------------------
| CORS CONFIGURATION
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:3000",
  // Add your deployed frontend URL below
  // "https://local-food-finder-frontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Explicitly handle preflight
app.options("*", cors());

/*
|--------------------------------------------------------------------------
| OTHER MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(morgan('dev'));

connectDB();

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api", routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to UI/LAUTECH Local Food Finder API');
});

setupSwagger(app);

app.use(notFound);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});