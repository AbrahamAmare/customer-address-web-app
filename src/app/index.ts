import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { db_conn } from "./configs/database";
import errorHandler from "../app/middleware/error-handler";
import { swaggerDocs, options } from "./utils/swagger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import session from "express-session";
import cookieParser from "cookie-parser";
dotenv.config();
// Routes
import authRoute from "../app/routes/auth.route";
import userRoute from "../app/routes/user.route";
import customerRoute from "../app/routes/customer.route";
import ErrorResponse from "./utils/error-response";

// INSTANTIATE EXPRESS
const app = express();
app.use(cookieParser());
// app.use(
//   session({
//     secret: "e80ad9d8-adf3-463f-80f4-7c4b39f7f164",
//     cookie: {
//       sameSite: "none",
//       maxAge: 24 * 60 * 60,
//       // secure: true,
//     },
//   })
// );

//  MIDDLEWARES
app.use(bodyParser.json());

// INITIALIZE MONGO DB CONNECTION
db_conn();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const swaggerSpec = swaggerJsdoc(options);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/customers", customerRoute);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = res
    .status(404)
    .json(
      new ErrorResponse(
        404,
        `The path '${req.originalUrl}' does not exist on the server`
      )
    );
  next(error);
});
app.use(errorHandler);

export default app;
