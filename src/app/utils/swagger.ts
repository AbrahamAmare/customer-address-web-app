import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../../../package.json";

export const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Customer Info Book API",
      version: "0.1.0",
      description: "This a simple customer information managing api",
      contact: {
        name: "abraham",
        email: "abraham@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:6001",
        description: "Development Server",
      },
    ],
  },
  apis: ["../../../dist/app/routes/user.route.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: Number) => {
  app.use("/docs", swaggerUi.setup(swaggerSpec));

  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
