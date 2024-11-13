const express = require("express");
const {
  aiConfigration,
  aiGemini,
  aiGeminiFile,
} = require("../Controllers/google.ai.controller");
// const { uploadFile } = require("../middleware/multer");

const router = express.Router();

router
  .route("/generate")
  .post(aiConfigration, uploadFile.single("file"), aiGeminiFile);
  // .post(aiConfigration, aiGemini);

module.exports = router;
