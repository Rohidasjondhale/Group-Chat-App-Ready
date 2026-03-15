const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const mediaController = require("../controllers/mediaController");

router.post("/upload-media", upload.single("file"), mediaController.uploadMedia);

module.exports = router;
