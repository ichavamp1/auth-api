import { Router } from "express";
import fs from "fs";
import db from "../database.json";
import { authMiddleware } from "./Auth";
import { UserDTO } from "../types";
const UserRouter = Router();

/** 
 * @swagger
 * /api/users/{userId}/add_to_cart/{productId}:
 *   post:
 *     summary: Adds a product to the user's cart
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Returns user data and the auth token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#components/schemas/UserRegister"
 *       401:
 *        description: Unauthorized
 *       404:
 *         description: User or product does not exist
 * /api/users/{userId}/delete_from_cart/{productId}:
 *   delete:
 *     summary: Deletes a product to the user's cart
 *     tags: [Users]
 *     security:
 *       - BearerAuth: [write]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Returns user data and the auth token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#components/schemas/UserRegister"
 *       401:
 *        description: Unauthorized
 *       404:
 *         description: User or product does not exist
 */

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhZG1pbjQiLCJjYXJ0IjpbXSwiaWF0IjoxNzIxNDg4OTI0LCJleHAiOjE3MjE1MTA1MjR9.LmaMjNayHN5dpnaN70WfcVS_oxVHZcfX2yTbhbKTFbc"

UserRouter.post("/:userId/add_to_cart/:productId", authMiddleware, (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);

  const targetUser = db.Users.data.find(item => item.id == userId);
  const targetProduct = db.Products.data.find(item => item.id == productId);

  if (targetUser == null) return res.status(404).json("User not found");
  if (targetProduct == null) return res.status(404).json("Product not found");

  (targetUser.cart as number[]).push(targetProduct.id);
  fs.writeFile("./src/database.json", JSON.stringify(db, null, 2), err => {
    if (err) return res.status(500).json("An error has occurred");
  });

  const payload: UserDTO = {
    id: targetUser.id,
    username: targetUser.username,
    cart: targetUser.cart
  }
  return res.status(200).json(payload);
});

UserRouter.delete("/:userId/delete_from_cart/:productId", authMiddleware, (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);

  const targetUser = db.Users.data.find(item => item.id == userId);
  const targetProduct = db.Products.data.find(item => item.id == productId);

  if (targetUser == null) return res.status(404).json("User not found");
  if (targetProduct == null) return res.status(404).json("Product not found");

  if (targetUser.cart.find(item => item == productId) == null) return res.status(404).json("User doesn't have the product in his cart");

  targetUser.cart.splice((targetUser.cart as number[]).indexOf(productId), 1);

  fs.writeFile("./src/database.json", JSON.stringify(db, null, 2), err => {
    if (err) return res.status(500).json("An error has occurred");
  });

  const payload: UserDTO = {
    id: targetUser.id,
    username: targetUser.username,
    cart: targetUser.cart
  }
  return res.status(200).json(payload);
});

export default UserRouter;