import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import AuthRouter from "./routes/Auth";
import ProductRouter from "./routes/Product";
const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authenticated CRUD Application',
      version: '1.0.0',
    },
  },
  apis: ["./dist/routes/*.js"]
}

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(options)));
app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);

/**
 * @swagger
 * tags:
 *   name: Products
 *   name: Users
 */

app.listen(3000, () => console.log("Hello world"));