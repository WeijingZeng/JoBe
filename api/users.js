const express = require('express');
const router = express.Router();
const data = require("../src/data");
const userData = data.users;

router.get("/getAllUsers", (req, res) => {
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

router.get("/getPotentialMatches/:id", (req, res) => {
    userData.getPotentialMatches(req.params.id).then((userList) => {
        res.status(200).json(userList);
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

router.post("/", (req, res) => {
    let userInfo = req.body;

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    userData.addUser(firebaseID,
        username,
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        age,
        long,
        lat,
        seeking,
        studioSWUsed,
        mainGenre,
        secondGenre,
        thirdGenre,
        hasSpace,
        bio,
        achivements,
        role,
        links,
        influences,
        lastLogin,
        profilePhotoUrl,
        localRemoteOrAll,
        distanceIfLocal)
        .then((newUser) => {
            res.json(newUser);
        }, () => {
            res.sendStatus(500);
        });
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