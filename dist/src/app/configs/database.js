"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_conn = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_conn = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await mongoose_1.default.connect(process.env.LOCAL_CONNECTION_STRING);
            console.log("Connected to local database successfully...");
        }
        else {
            // await mongoose.connect(process.env.PROD_CONNECTION_STRING);
            await mongoose_1.default.connect(process.env.LOCAL_CONNECTION_STRING);
            console.log("Connected to production database successfully...");
        }
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.db_conn = db_conn;
//# sourceMappingURL=database.js.map