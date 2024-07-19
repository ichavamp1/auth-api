import { Router } from "express";
import { Products } from "../database.json";
const ProductRouter = Router();

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
  return res.status(200).json(Products);
});

export default ProductRouter;