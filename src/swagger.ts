// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const SERVER_URL = process.env.SERVER_URL || process.env.PORT;

// Swagger options
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Local Food Finder API",
      version: "1.0.0",
      description: "API documentation for Food Finder backend",
    },
    servers: [
      {
        url: process.env.SERVER_URL
      },
    ],
  },
  // Path to your API files with annotations
  apis: ["./src/routes/*.ts"], // <-- your route files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Function to setup swagger in Express
export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
