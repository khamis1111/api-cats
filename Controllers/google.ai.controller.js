const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

const aiConfigration = async (req, res, next) => {
  try {
    const apiKey = "AIzaSyAw3fuaejoPbR6t3lEoI5TbxhOF1iVp_Gs";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    req.model = model;
    req.config = generationConfig;

    next();
  } catch (error) {
    return res.status(401).json({ status: "fail", err: error });
  }
};

const aiGemini = async (req, res) => {
  try {
    const { text } = req.body;
    const result = await req.model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
      generationConfig: req.config,
    });

    return res
      .status(200)
      .json({ status: "success", data: result.response.text() });
  } catch (error) {
    return res.status(401).json({ status: "fail", err: error });
  }
};

const aiGeminiFile = async (req, res) => {
  const { text } = req.body;
  const file = req.file;
  const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY); // Use environment variable for API key
  let files;

  if (file) {
    async function uploadToGemini(path, mimeType) {
      try {
        const uploadResult = await fileManager.uploadFile(path, {
          mimeType,
          displayName: path,
        });
        console.log(
          `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.name}`
        );
        return uploadResult.file;
      } catch (error) {
        return res.status(401).json({
          status: "fail",
          err: `File upload failed: ${error.message}`,
        });
      }
    }

    async function waitForFilesActive(files) {
      console.log("Waiting for file processing...");
      for (const name of files.map((file) => file.name)) {
        let file = await fileManager.getFile(name);
        while (file.state === "PROCESSING") {
          process.stdout.write(".");
          await new Promise((resolve) => setTimeout(resolve, 10000));
          file = await fileManager.getFile(name);
        }
        if (file.state !== "ACTIVE") {
          return res.status(401).json({
            status: "fail",
            err: `File ${file.name} failed to process`,
          });
        }
      }
      console.log("...all files ready\n");
    }

    const uploadedFile = await uploadToGemini(file.path, file.mimetype);
    if (!uploadedFile) return; // Stop execution if file upload failed
    files = [uploadedFile];
    await waitForFilesActive(files);
  }

  if (!req.model || !req.config) {
    return res.status(400).json({
      status: "fail",
      err: "Model or configuration missing.",
    });
  }

  const chatSession = req.model.startChat({
    generationConfig: req.config,
    history: [
      req.file
        ? {
            role: "user",
            parts: [
              {
                fileData: {
                  mimeType: files[0].mimeType,
                  fileUri: files[0].uri,
                },
              },
              {
                text:
                  "read this file and choose the correct answer and return the correct answer only and choose one answer: " +
                  text,
              },
            ],
          }
        : { role: "user", parts: [{ text }] },
    ],
  });

  const result = await chatSession.sendMessage(text);
  if (result && result.response && result.response.text()) {
    return res.status(200).json({
      status: "success",
      data: result.response.text(),
    });
  } else {
    return res.status(500).json({
      status: "fail",
      err: "Failed to get a valid response from the AI.",
    });
  }

  // File deletion
  const deleteFilesInUploads = async () => {
    const uploadsDir = path.resolve("uploads");
    try {
      const files = await fs.promises.readdir(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        await fs.promises.unlink(filePath);
        console.log(`File deleted: ${filePath}`);
      }
    } catch (error) {
      return res.status(401).json({
        status: "fail",
        err: `Error deleting files: ${error}`,
      });
    }
  };
  await deleteFilesInUploads();
};

module.exports = { aiConfigration, aiGemini, aiGeminiFile };
