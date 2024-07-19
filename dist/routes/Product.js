"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_json_1 = require("../database.json");
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
 * */
ProductRouter.get("/all", (req, res) => {
    return res.status(200).json(database_json_1.Products);
});
exports.default = ProductRouter;
