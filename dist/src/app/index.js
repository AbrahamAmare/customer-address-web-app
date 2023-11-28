"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const database_1 = require("./configs/database");
const error_handler_1 = __importDefault(require("../app/middleware/error-handler"));
const swagger_1 = require("./utils/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
// Routes
const auth_route_1 = __importDefault(require("../app/routes/auth.route"));
const user_route_1 = __importDefault(require("../app/routes/user.route"));
const customer_route_1 = __importDefault(require("../app/routes/customer.route"));
const error_response_1 = __importDefault(require("./utils/error-response"));
// INSTANTIATE EXPRESS
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
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
app.use(body_parser_1.default.json());
// INITIALIZE MONGO DB CONNECTION
(0, database_1.db_conn)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
}));
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.options);
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/customers", customer_route_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, { explorer: true }));
app.all("*", (req, res, next) => {
    const error = res
        .status(404)
        .json(new error_response_1.default(404, `The path '${req.originalUrl}' does not exist on the server`));
    next(error);
});
app.use(error_handler_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map