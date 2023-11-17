import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { db_conn } from "./configs/database";
// import errorHandler from "../app/utils/error-handler.utils";
import errorHandler from "../app/middleware/error-handler";

dotenv.config();

// Routes
import authRoute from "../app/routes/auth.route";
import userRoute from "../app/routes/user.route";
import customerRoute from "../app/routes/customer.route";
import ErrorResponse from "./utils/error-response";

// INSTANTIATE EXPRESS
const app = express();

//  MIDDLEWARES
app.use(cookieParser());
app.use(bodyParser.json());

// INITIALIZE MONGO DB CONNECTION
db_conn();

// app.use(cors({
//     //credentials: true,
//     origin: 'http://localhost:5173'
// }))

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/customers", customerRoute);

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
