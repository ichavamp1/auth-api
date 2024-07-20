import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import db from "../database.json";
import { IUser, UserDTO } from "../types";
const AuthRouter = Router();

const SECRET = "172764f845600752fdb179b94bc876ff";

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
 *     summary: Returns an auth token based on the input
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
 *       400:
 *        description: Username or password were not provided
 *       404:
 *         description: User does not exist
 *       500:
 *         description: Server error
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
 *                $ref: "#components/schemas/UserRegister"
 *        400:
 *          description: Username or password were not provided
 *        404:
 *          description: An user with provided username already exists
 *        500:
 *          description: Server error
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

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhZG1pbjQiLCJjYXJ0IjpbXSwiaWF0IjoxNzIxNDI0MzAwLCJleHAiOjE3MjE0NDU5MDB9.L3QpNs8Bg0aQDWi05nOPTEV0jtsMqXfZXcmaQ6MrOwI"

export function authMiddleware(req: Request, res: Response, next: NextFunction){
  console.log(req.headers);
  const authToken = (req.headers["authorization"] == null) ? null : req.headers["authorization"].split(" ")[1];

  if (authToken == null) return res.status(401).json("Unauthorized");

  jwt.verify(authToken, SECRET, (err, payload) => {
    if (err) return res.status(401).json("Unauthorized");

    next();
  });
}

AuthRouter.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) return res.status(400).json("Invalid request body");

  const alreadyExists = db.Users.data.find(item => item.username == username) != null;

  if (alreadyExists) return res.status(404).json("User already exists");

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json("An error has occurred");

    const newUser: IUser = {
      id: db.Users.last_id + 1,
      username,
      password: hash,
      cart: []
    };

    db.Users.last_id++;
    (db.Users.data as IUser[]).push(newUser);
    
    fs.writeFile("./src/database.json", JSON.stringify(db, null, 2), err => {
      if (err) return res.status(500).json("An error has occurred");
    });

    const payload: UserDTO = {
      id: newUser.id,
      username,
      cart: []
    }
    return res.status(200).json(payload);
  });
});

AuthRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) return res.status(400).json("Invalid request body");

  const targetUser: IUser = (db.Users.data.find(item => item.username == username) as IUser);
  console.log(targetUser);

  if (targetUser == null) return res.status(404).json("User not found");

  bcrypt.compare(password, targetUser.password, (err, result) => {
    if (err) return res.status(500).json("An error has occurred");
    
    if (result == true){
      const payload: UserDTO = {
        id: targetUser.id,
        username: targetUser.username,
        cart: targetUser.cart
      };

      const authToken = jwt.sign(payload, SECRET, {expiresIn: "6h"});
      payload.authToken = authToken;
      return res.status(200).json(payload);
    }else{
      return res.status(401).json("Invalid password");
    }
  })
})

export default AuthRouter;