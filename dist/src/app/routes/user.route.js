"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("../controllers/users.controller");
const express_1 = __importDefault(require("express"));
const require_auth_1 = __importDefault(require("../middleware/require-auth"));
const router = express_1.default.Router();
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
router.route("/").get(require_auth_1.default, users_controller_1.getUsers).post(users_controller_1.createUser);
router.route("/:userId").get(users_controller_1.getUser).put(users_controller_1.updateUser).delete(users_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map