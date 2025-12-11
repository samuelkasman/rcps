import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ res: true });
});

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
