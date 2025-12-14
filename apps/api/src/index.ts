import cors from "cors";
import "dotenv/config";
import express from "express";
import ingredientsRouter from "./routes/ingredients";
import recipesRouter from "./routes/recipes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ ok: true });
});

app.use("/ingredients", ingredientsRouter);
app.use("/recipes", recipesRouter);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
