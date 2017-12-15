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
        if (user.error){
            res.status(404).json(user);
        } else {
            res.status(200).json(user);
        }
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

router.get("/getPotentialMatches/:userName", (req, res) => {
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

    userData.addUser(userInfo.firebaseID,
        userInfo.username,
        userInfo.firstName,
        userInfo.lastName,
        userInfo.email,
        userInfo.gender,
        userInfo.city,
        userInfo.state,
        userInfo.age,
        userInfo.long,
        userInfo.lat,
        userInfo.seeking,
        userInfo.studioSWUsed,
        userInfo.mainGenre,
        userInfo.secondGenre,
        userInfo.thirdGenre,
        userInfo.hasSpace,
        userInfo.bio,
        userInfo.achivements,
        userInfo.role,
        userInfo.links,
        userInfo.influences,
        userInfo.lastLogin,
        userInfo.profilePhotoUrl,
        userInfo.localRemoteOrAll,
        userInfo.distanceIfLocal)
        .then((newUser) => {
            res.json(newUser);
        }, (err) => {
            res.sendStatus(500).json(err);
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
