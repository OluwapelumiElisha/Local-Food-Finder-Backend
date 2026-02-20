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

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...envOrigins,
]);

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (curl/Postman) and same-origin requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

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
