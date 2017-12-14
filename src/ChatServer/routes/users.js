const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.get("/", (req, res) => {
    userData.getAllUsers().then((userList) => {
        res.status(200).json(userList);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.get("/:id", (req, res) => {
    userData.getUserById(req.params.id).then((user) => {
        res.status(200).json(user);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});


router.get("/:userName", (req, res) => {
    userData.getPotentialMatches(req.params.name).then((user) => {
        res.status(200).json(user);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.post("/", async (req, res) => {
    let userInfo = req.body;
    console.log("tried to put a person in! with id of " + userInfo.firebaseId );
    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    try{
    let newUser =await userData.addUser(userInfo.firebaseId,
        userInfo.email,
        userInfo.lastLogin)
    console.log("new user added! " + newUser);
        res.json(newUser);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete("/:id", (req, res) => {
    let user = userData.getUserById(req.params.id).then(() => {
        return userData.removeUser(req.params.id)
            .then((remainingUser) => {
                res.json(remainingUser);
            }).catch(() => {
                res.sendStatus(500);
            });
    }).catch((err) => {
        console.log(err);
        res.status(404).json({ error: "user not found" });
    });
});


module.exports = router;
