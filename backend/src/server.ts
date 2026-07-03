import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from "express-session";
import passport from "passport";

import "./auth/passport.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import githubRoutes from "./routes/github.routes.js";


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

app.use(passport.initialize());

app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/github", githubRoutes);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "ai-repo-explainer-api"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});