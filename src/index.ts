import express from "express";
import AuthRouter from "./routes/AuthRouter";
import ProductRouter from "./routes/ProductRouter";
const app = express();

app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);

app.listen(3000, () => console.log("Hello world"));