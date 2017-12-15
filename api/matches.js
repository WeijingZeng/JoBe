const express = require('express');
const router = express.Router();
const data = require("../src/data");
const matchData = data.matches;

router.get("/imInterested/:interestedUid/:interestedInUid", async (req, res) => {
    try {
        let result = await matchData.imInterested(req.params.interestedUid, req.params.interestedInUid);
        res.status(200).json(result);
    } catch (e){
        res.status(500).json({ error: e });
    }
});

router.get("/getMatchByUIDS/:uid1/:uid2", async (req, res) => {
    try {
        let result = await matchData.getMatchByUIDS(req.params.uid1, req.params.uid2);
        res.status(200).json(result);
    } catch (e){
        res.status(500).json({ error: e });
    }
});

router.get("/getMutualMatches/:uid", async (req, res) => {
    try {
        let result = await matchData.getMutualMatches(req.params.uid);
        res.status(200).json(result);
    } catch (e){
        res.status(500).json({ error: e });
    }
});

router.get("/addMatch/:uid1/:uid2", async (req, res) => {
    try {
        let result = await matchData.addMatch(req.params.uid1, req.params.uid2);
        res.status(200).json(result);
    } catch (e){
        res.status(500).json({ error: e });
    }
});


module.exports = router;
