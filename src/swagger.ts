// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

// Use SERVER_URL if defined, fallback to localhost + port
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;

// Detect environment
const isProd = process.env.NODE_ENV === "production";

// Path to route files
const apis = isProd
  ? [path.join(__dirname, "./routes/*.js")] // compiled JS in dist/
  : ["./src/routes/*.ts"];                  // TS files in dev

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