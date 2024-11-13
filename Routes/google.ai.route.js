const express = require("express");
const {
  textAndImg,
} = require("../Controllers/google.ai.controller");
const { uploadFile } = require("../middleware/multer");

const router = express.Router();

// router
//   .route("/generate")
//   .post(aiConfigration, uploadFile.single("file"), aiGeminiFile);

router
  .route("/generate")
  .post(uploadFile.single("file"), textAndImg);

module.exports = router;
