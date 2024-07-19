"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_json_1 = __importDefault(require("../database.json"));
const AuthRouter = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        id:
 *          type: int
 *        username:
 *          type: string
 *        password:
 *          type: string
 *        cart:
 *          type: int
 *          description:
 *            Array of foreign keys
 *        authToken:
 *          type: string
 *      example:
 *        id: 1
 *        username: SomberBear
 *        cart: [1, 2, 3]
 *        authToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhZG1pbjQiLCJjYXJ0IjpbXSwiaWF0IjoxNzIxNDI0MzAwLCJleHAiOjE3MjE0NDU5MDB9.L3QpNs8Bg0aQDWi05nOPTEV0jtsMqXfZXcmaQ6MrOwI
 *    UserRegister:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        id:
 *          type: int
 *        username:
 *          type: string
 *        password:
 *          type: string
 *        cart:
 *          type: int
 *          description:
 *            Array of foreign keys
 *      example:
 *        id: 1
 *        username: SomberBear
 *        cart: [1, 2, 3]
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Accepts user credentials and returns an auth token based on the input
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Returns user data and the auth token
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#components/schemas/User"
 *                 test: hm
 *       404:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: An error has occurred
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *             example:
 *               username: SomberBear
 *               password: parol
 * /api/auth/register:
 *    post:
 *      summary: Creates a new user with the provided data
 *      tags: [Users]
 *      responses:
 *        200:
 *          description: The new user has been stored in the database
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#components/schemas/UserRegister"
 *        404:
 *          description: An user with provided username already exists
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: User already exists
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: An error has occurred
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  password:
 *                    type: string
 *              example:
 *                username: SomberBear
 *                password: parol
 */
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhZG1pbjQiLCJjYXJ0IjpbXSwiaWF0IjoxNzIxNDI0MzAwLCJleHAiOjE3MjE0NDU5MDB9.L3QpNs8Bg0aQDWi05nOPTEV0jtsMqXfZXcmaQ6MrOwI";
AuthRouter.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username == null || password == null)
        return res.status(400).json("Invalid request body");
    const alreadyExists = database_json_1.default.Users.data.find(item => item.username == username) != null;
    if (alreadyExists)
        return res.status(404).json("User already exists");
    bcrypt_1.default.hash(password, 10, (err, hash) => {
        if (err)
            return res.status(500).json("An error has occurred");
        const newUser = {
            id: database_json_1.default.Users.last_id + 1,
            username,
            password: hash,
            cart: []
        };
        database_json_1.default.Users.last_id++;
        database_json_1.default.Users.data.push(newUser);
        fs_1.default.writeFile("./src/database.json", JSON.stringify(database_json_1.default, null, 2), err => {
            if (err)
                return res.status(500).json("An error has occurred");
        });
        const payload = {
            id: newUser.id,
            username,
            cart: []
        };
        return res.status(200).json(payload);
    });
});
AuthRouter.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username == null || password == null)
        return res.status(400).json("Invalid request body");
    const targetUser = database_json_1.default.Users.data.find(item => item.username == username);
    console.log(targetUser);
    if (targetUser == null)
        return res.status(404).json("User not found");
    bcrypt_1.default.compare(password, targetUser.password, (err, result) => {
        if (err)
            return res.status(500).json("An error has occurred");
        if (result == true) {
            const payload = {
                id: targetUser.id,
                username: targetUser.username,
                cart: targetUser.cart
            };
            const authToken = jsonwebtoken_1.default.sign(payload, "172764f845600752fdb179b94bc876ff", { expiresIn: "6h" });
            payload.authToken = authToken;
            return res.status(200).json(payload);
        }
        else {
            return res.status(401).json("Invalid password");
        }
    });
});
exports.default = AuthRouter;
