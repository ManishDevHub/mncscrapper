import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route";
import blogRouter from "./routes/blog.route";
import jobRouter from "./routes/job.route";
import companyRouter from "./routes/company.route";
import productRouter from "./routes/product.route";
import roundRouter from "./routes/round.route";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://mncscrapper-fjsd.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({
        message: "MNC Scrapper / CareerHub API working fine",
        version: "1.0.0"
    });
});

// Primary API routes
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/job", jobRouter);
app.use("/api/company", companyRouter);
app.use("/api/company/product", productRouter);
app.use("/api/company/round", roundRouter);

// Backwards compatibility mounts
app.use("/company", companyRouter);
app.use("/company/product", productRouter);
app.use("/company/round", roundRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} running`);
});
