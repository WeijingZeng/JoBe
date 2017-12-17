const express = require('express');
const router = express.Router();
const data = require("../src/data");
const genreData = data.genres;

router.get("/", async (req, res) => {
    try {
        let result = await genreData.getAllGenres();
        res.status(200).json(result);
    } catch (e){
        res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let result = await genreData.getGenreByID(req.params.id);
        res.status(200).json(result);
    } catch (e){
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
