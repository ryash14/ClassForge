import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 4000;

// Fix __dirname issue in ES Module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "public" directory
app.use(express.static("public"));

app.use(cors({ origin: "*" })); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for image uploads
const upload = multer({ dest: "uploads/" });

// Replace this with your actual API Key
const API_KEY = "AIzaSyDBkLWso0FSdmkskukhRQpQPAOyuiE1VaI";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to convert files to generative parts
const fileToGenerativePart = (path, mimeType) => ({
  inlineData: {
    data: fs.readFileSync(path).toString("base64"),
    mimeType,
  },
});

// Serve index.html on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ping test route
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Route to handle image uploads and text generation
app.post("/generate", upload.array("images"), async (req, res) => {
  try {
    let { prompt } = req.body;
    const files = req.files || [];

    if (!prompt && files.length === 0) {
      return res
        .status(400)
        .json({ error: "Provide at least a prompt or an image" });
    }

    prompt = `Please generate a question paper based on the syllabus given in the text or in the uploaded image.
    After generating the question paper, provide answers for each question:
    - 2 marks: 4 points
    - 5 marks: 8 points
    - 10 marks: 15 points
    Each point should be concise and well-explained.
    Question: ${prompt}
    Answer:`;

    const imageParts = files.map((file) =>
      fileToGenerativePart(file.path, file.mimetype)
    );

    let text = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      model
        .generateContent([prompt, ...imageParts])
        .then((result) => {
          const response = result.response;
          text = response.text();

          text = text.replace(/\n/g, "\\n").replace(/\t/g, "\\t");

          // Delete uploaded files after processing
          files.forEach((file) => fs.unlinkSync(file.path));

          res.send({ result: text });
        })
        .catch((e) => {
          console.error("Error generating content:", e);
          res.send({ error: "Failed to generate content" });
        });
    } catch (e) {
      console.error("Error generating content:", e);
      res.send({ error: "Failed to generate content" });
    }
  } catch (error) {
    console.error("Error generating content:", error);
    res.send({ error: "Failed to generate content" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
