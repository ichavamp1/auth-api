import { Router } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import db from "../database.json";
import { User } from "../types";
const AuthRouter = Router();

AuthRouter.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) return res.status(400).json("Invalid request body");

  const alreadyExists = db.Users.data.find(item => item.username == username) != null;

  if (alreadyExists) return res.status(404).json("User already exists");

  bcrypt.genSalt(10, (err, hash) => {
    if (err) return res.status(500).json("An error has occurred");

    const newUser: User = {
      id: db.Users.last_id + 1,
      username,
      password: hash,
      cart: []
    };

    db.Users.last_id++;
    (db.Users.data as User[]).push(newUser);
    
    fs.writeFileSync("./src/database.json", JSON.stringify(db, null, 2));

    return res.status(200).json({id: newUser.id,username});
  });
})

export default AuthRouter;