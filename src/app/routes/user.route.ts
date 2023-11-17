import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/users.controller";
import validate from "../middleware/schema-validator";
import express from "express";
import requireAuth from "../middleware/require-auth";

const router = express.Router();
router.route("/").get(requireAuth, getUsers).post(createUser);
router.route("/:userId").get(getUser).put(updateUser).delete(deleteUser);

export default router;
