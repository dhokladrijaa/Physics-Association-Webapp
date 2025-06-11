import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve the /frontend folder as static
const frontendPath = path.resolve(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Serve index.html when visiting /
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// API endpoint
app.get("/api/:file", async (req, res) => {
  const { file } = req.params;
  try {
    const data = await fs.readFile(
      path.join(__dirname, "sample-data", `${file}.json`),
      "utf-8"
    );
    res.json(JSON.parse(data));
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(PORT, () =>
  console.log(`Physics site running at http://localhost:${PORT}`)
);
