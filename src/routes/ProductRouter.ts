import { Router } from "express";
import { Products } from "../database.json";
const ProductRouter = Router();

ProductRouter.get("/all", (req, res) => {
  return res.status(200).json(Products);
});

export default ProductRouter;