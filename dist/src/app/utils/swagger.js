"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = exports.options = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.options = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(exports.options);
const swaggerDocs = (app, port) => {
    app.use("/docs", swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
exports.swaggerDocs = swaggerDocs;
//# sourceMappingURL=swagger.js.map