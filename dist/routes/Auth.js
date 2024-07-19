"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const database_json_1 = __importDefault(require("../database.json"));
const AuthRouter = (0, express_1.Router)();
AuthRouter.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username == null || password == null)
        return res.status(400).json("Invalid request body");
    const alreadyExists = database_json_1.default.Users.data.find(item => item.username == username) != null;
    if (alreadyExists)
        return res.status(404).json("User already exists");
    bcrypt_1.default.genSalt(10, (err, hash) => {
        if (err)
            return res.status(500).json("An error has occurred");
        const newUser = {
            id: database_json_1.default.Users.last_id + 1,
            username,
            password: hash,
            cart: []
        };
        database_json_1.default.Users.last_id++;
        database_json_1.default.Users.data.push(newUser);
        fs_1.default.writeFileSync("./src/database.json", JSON.stringify(database_json_1.default, null, 2));
        return res.status(200).json({ id: newUser.id, username });
    });
});
exports.default = AuthRouter;
