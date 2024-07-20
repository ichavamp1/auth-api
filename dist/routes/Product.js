"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const database_json_1 = __importDefault(require("../database.json"));
const ProductRouter = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *        - name
 *        - price
 *      properties:
 *        id:
 *          type: int
 *        name:
 *          type: string
 *        price:
 *          type: float
 *      example:
 *        id: 1
 *        name: Garmin Forerunner 245
 *        price: 19.99
 *
 */
/**
 * @swagger
 * /api/products/new:
 *    post:
 *      summary: Adds a new object based on the provided input
 *      tags: [Products]
 *      responses:
 *        200:
 *          description: The new product
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#components/schemas/Product"
 *        400:
 *          description: Invalid request body
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 * /api/products/all:
  *    get:
  *      summary: Returns a list of all products
  *      tags: [Products]
  *      responses:
  *        200:
  *          description: The list of the products
  *          content:
  *            application/json:
  *              schema:
  *                type: array
  *                items:
  *                  $ref: "#components/schemas/Product"
 * /api/products/edit/{id}:
 *   post:
 *    summary: Updates a product based on the params id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns the updated product
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#components/schemas/Product"
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              price:
 *                type: number
 * */
//CREATE
ProductRouter.post("/new", (req, res) => {
    const { name, price } = req.body;
    if (name == null || price == null || isNaN(parseFloat(price)))
        return res.status(400).json("Invalid request body");
    const newProduct = {
        id: database_json_1.default.Products.last_id + 1,
        name: name,
        price: parseFloat(price)
    };
    database_json_1.default.Products.last_id++;
    database_json_1.default.Products.data.push(newProduct);
    fs_1.default.writeFile("./src/database.json", JSON.stringify(database_json_1.default, null, 2), err => {
        if (err)
            return res.status(500).json("An error has occurred");
    });
    return res.status(200).json(newProduct);
});
//READ
ProductRouter.get("/all", (req, res) => {
    return res.status(200).json(database_json_1.default.Products.data);
});
//UPDATE
ProductRouter.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    if (name == null || price == null || isNaN(parseFloat(price)))
        return res.status(400).json("Invalid request body");
    const target = database_json_1.default.Products.data.find(item => item.id == id);
    if (target == null)
        return res.status(404).json("Product was not found");
    target.name = name;
    target.price = parseFloat(price);
    fs_1.default.writeFile("./src/database.json", JSON.stringify(database_json_1.default, null, 2), err => {
        if (err)
            return res.status(500).json("An error has occurred");
    });
    return res.status(200).json(target);
});
exports.default = ProductRouter;
