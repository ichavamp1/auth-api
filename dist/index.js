"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const Auth_1 = __importDefault(require("./routes/Auth"));
const Product_1 = __importDefault(require("./routes/Product"));
const app = (0, express_1.default)();
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: ["./dist/routes/*.js"]
};
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(options)));
app.use("/api/auth", Auth_1.default);
app.use("/api/products", Product_1.default);
app.get("/lol");
app.listen(3000, () => console.log("Hello world"));
