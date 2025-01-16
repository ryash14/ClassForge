import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 2000;

// Fix __dirname in ES Module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when accessing "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
