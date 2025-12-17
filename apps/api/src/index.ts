import cors from "cors";
import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth";
import ingredientsRouter from "./routes/ingredients";
import recipesRouter from "./routes/recipes";

const app = express();

// TODO: Production security checklist
// 1. CORS - Restrict to allowed origins only:
//    app.use(cors({ origin: [process.env.WEB_URL], credentials: true }));
// 2. Rate limiting - Add express-rate-limit to prevent brute force:
//    import rateLimit from 'express-rate-limit';
//    app.use('/auth', rateLimit({ windowMs: 15*60*1000, max: 100 }));
// 3. Helmet - Add security headers:
//    import helmet from 'helmet';
//    app.use(helmet());
// 4. Request size limit - Prevent large payload attacks:
//    app.use(express.json({ limit: '10kb' }));

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/recipes", recipesRouter);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
