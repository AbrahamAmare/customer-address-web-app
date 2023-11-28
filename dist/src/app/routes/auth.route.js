"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route("/sign-in").post(auth_controller_1.signIn);
router.route("/sign-up").post(auth_controller_1.signUp);
router.route("/sign-out").post(auth_controller_1.signOut);
router.route("/change-password/:userId").patch(auth_controller_1.changePassword);
router.route("/forgot-password").patch(auth_controller_1.forgotPassword);
router.route("/reset-password/:resetToken").patch(auth_controller_1.resetPassword);
router.route("/confirm-email/:confirmationToken").patch(auth_controller_1.confirmEmail);
exports.default = router;
//# sourceMappingURL=auth.route.js.map