const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();
const profilePic = require("../src/tasks/profilePic");

router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) res.status(400).json({ error: "No file" });

    try {
        let buf = req.file.buffer;
        let resizedBuf = await profilePic.resizeAndCrop(buf);
        let url = await profilePic.uploadToS3AndReturnUrl(resizedBuf);
        res.json({ url: url });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
