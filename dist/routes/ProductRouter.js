"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_json_1 = require("../database.json");
const ProductRouter = (0, express_1.Router)();
ProductRouter.get("/all", (req, res) => {
    return res.status(200).json(database_json_1.Products);
});
exports.default = ProductRouter;
