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

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *        - confirmPassword
 *        - gender
 *      properties:
 *        - -id:
 *            type: string
 *            description: auto-generated id of the book
 *        - firstName:
 *            type: string
 *            description: user first name
 *        - lastName:
 *            type: string
 *            description: user last name
 *        - fullName:
 *            type: string
 *            description: user full name
 *        - email:
 *            type: string
 *            description: user email
 *        - gender:
 *            type: string
 *            description: user gender
 *        - createdAt:
 *            type: date
 *            description: user entity creation date
 *        - updatedAt:
 *            type: date
 *            description: user entity updated date
 *        - isEmailConfirmed:
 *            type: boolean
 *            description: a status for checking users email confirmation
 *        - auth:
 *            type: object
 *            description: user cookie auth session
 *            properties:
 *              - sessionToken:
 *                  type: string
 *                  description: user cookie token
 *              - expiresAt:
 *                  type: date
 *                  description: cookie expiration date
 *
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /api/v1/books:
 *   get:
 *     summary: Lists all the books
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *
 */
router.route("/").get(requireAuth, getUsers).post(createUser);
router.route("/:userId").get(getUser).put(updateUser).delete(deleteUser);

export default router;
