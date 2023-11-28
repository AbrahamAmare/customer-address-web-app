"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./app/index"));
const portNum = Number.parseInt(process.env.PORT);
const port = portNum || 6001;
index_1.default.listen(port, () => {
    console.log("Environment", process.env.NODE_ENV);
    console.log(`Server is listening on http://localhost:${portNum}`);
});
//# sourceMappingURL=server.js.map