import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Dien je statische frontend-bestanden uit (pas map aan als nodig)
app.use(express.static(__dirname)); // serve files from repo root

app.get("/", (_req, res) => {
  res.send("<h1>Crawler frontend running</h1><p>Voeg hier je build of index.html toe.</p>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
