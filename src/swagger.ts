// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import fs from "fs";
import { envConfig } from "./config/env";


// Use SERVER_URL if defined, fallback to localhost + port
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${envConfig.port || 4000}`;

// Detect environment
const isProd = process.env.NODE_ENV === "production";

const resolveApiFiles = (): string[] => {
  const routesDir = isProd
    ? path.join(__dirname, "routes")
    : path.join(process.cwd(), "src", "routes");
  const extension = isProd ? ".js" : ".ts";

  if (!fs.existsSync(routesDir)) {
    return [];
  }

  return fs
    .readdirSync(routesDir)
    .filter((file) => file.endsWith(extension))
    .map((file) => path.join(routesDir, file));
};

const apis = resolveApiFiles();

// Swagger options — fixed for swagger-jsdoc v6+
const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Local Food Finder API",
      version: "1.0.0",
      description: "API documentation for Food Finder backend",
    },
    servers: [
      {
        url: SERVER_URL,
      },
    ],
  },
  apis,
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Function to setup swagger in Express
export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
