const express = require("express");
const router = express.Router();
const { multerInstance } = require("../../helpers");
const usersController = require("../../controller/users");
const authMiddleware = require("../../middlewares/jwt");

/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      BearerAuth:
 *        type: http
 *        scheme: bearer
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          -password
 *          -email
 *        properties:
 *           password:
 *             type: string
 *             description: User's password
 *           email:
 *             type: string,
 *             description: User's email
 *             unique: true
 *        example:
 *          password: DFw4323r4fwwttwre4t24t
 *          email: john.smith@gmail.com
 */

/**
 * @swagger
 * /api/users/signup/:
 *  post:
 *    tags:
 *    - users
 *    description: Sign up a new user
 *    security: []
 *    requestBody:
 *      description: Enter new email and password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Error
 *      409:
 *        description: Email in use
 */

router.post("/signup", usersController.add);

/**
 * @swagger
 * /api/users/login/:
 *  post:
 *    tags:
 *    - users
 *    description: Log in user
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      description: Enter new email and password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 *      
 */

router.post("/login", usersController.get);

/**
 * @swagger
 * /api/users/logout/:
 *  post:
 *    tags:
 *    - users
 *    description: Log out user
 *    security:
 *    - BearerAuth: []
 *    responses:
 *      204:
 *        description: Logged out
 *      404:
 *        description: Not found
 */

router.post("/logout", authMiddleware, usersController.logout);

/**
 * @swagger
 * /api/users/verify/:
 *  post:
 *    tags:
 *    - users
 *    description: Resend verification email
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      description: Enter email to resend verification email
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              -email
 *            properties:
 *              email:
 *                type: string
 *                description: User's email
 *            example:
 *              email: john.smith@gmail.com
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request 
 */

router.post('/verify', usersController.verifyAgain)

/**
 * @swagger
 * /api/users/current/:
 *  get:
 *    tags:
 *    - users
 *    description: Check currently logged user
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */

router.get("/current", authMiddleware, usersController.check);

/**
 * @swagger
 * /api/users/verify/:verificationToken/:
 *  get:
 *    tags:
 *    - users
 *    description: Verify email by clicking link in verification email
 *    parameters:
 *      - in: path
 *        name: verificationToken
 *        schema:
 *          type: string
 *        required: true
 *        description: Token is placed in params automatically when verification link is clicked
 *    responses:
 *      200:
 *        description: Success
 *      400: 
 *        description: Bad request
 */

router.get('/verify/:verificationToken', usersController.verify)

/**
 * @swagger
 * /api/users/:
 *  patch:
 *    tags:
 *    - users
 *    description: Change subscription
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      description: Select subscription
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              -subscription
 *            properties:
 *              subscription:
 *                type: string,
 *                description: starter, pro, business
 *            example:
 *              subscription: pro
 *    responses:
 *      201:
 *        description: Changed
 *      400:
 *        description: Bad request
 */

router.patch("/", authMiddleware, usersController.subs);

/**
 * @swagger
 * /api/users/avatars/:
 *  patch:
 *    tags:
 *    - users
 *    description: Upload user's avatar
 *    security:
 *      - BearerAuth: []
 *    consumes:
 *      - multipart/form-data
 *    requestBody:
 *      description: Select file to upload
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              picture:
 *                type: string
 *                format: binary
 *                description: The key name must be "picture"
 *    example: image.png
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 * 
 */

router.patch(
  "/avatars", authMiddleware,
  multerInstance.single("picture"),
  usersController.setAvatar,
);

module.exports = router;
