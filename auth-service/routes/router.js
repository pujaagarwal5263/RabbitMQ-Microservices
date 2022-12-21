const express=require("express");
const router=express.Router();
const User=require("../User")
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({ message: "User already exists" });
    } else {
        const newUser = await User.create({email, name, password});
        return res.json(newUser);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.json({ message: "User doesn't exist" });
    } else {
        if (password !== userExists.password) {
            return res.json({ message: "Password Incorrect" });
        }
        const payload = {email,name: userExists.name};

        jwt.sign(payload, "secret", (err, token) => {
            if (err) console.log(err);
            else return res.json({ token: token });
        });
    }
});


module.exports=router;