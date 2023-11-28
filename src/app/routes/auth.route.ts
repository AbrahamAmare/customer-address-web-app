import {
  signIn,
  signUp,
  changePassword,
  forgotPassword,
  resetPassword,
  confirmEmail,
  signOut,
} from "../controllers/auth.controller";
import validate from "../middleware/schema-validator";
import express from "express";

const router = express.Router();
router.route("/sign-in").post(signIn);
router.route("/sign-up").post(signUp);
router.route("/sign-out").post(signOut);

router.route("/change-password/:userId").patch(changePassword);
router.route("/forgot-password").patch(forgotPassword);
router.route("/reset-password/:resetToken").patch(resetPassword);
router.route("/confirm-email/:confirmationToken").patch(confirmEmail);
export default router;
