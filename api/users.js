const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.get("/getAllUsers", async (req, res, next) => {
    try {
        let allUsers = await userData.getAllUsers();
        res.json(allUsers);
    } catch (err){
        res.status(500).json(err);
    }
});