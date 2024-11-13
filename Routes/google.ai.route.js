const express = require("express");
const {
  aiConfigration,
  aiGeminiFile,
} = require("../Controllers/google.ai.controller");
const { uploadFile } = require("../middleware/multer");

const router = express.Router();

router
  .route("/generate")
  .post(aiConfigration, uploadFile.single("file"), aiGeminiFile);

module.exports = router;
