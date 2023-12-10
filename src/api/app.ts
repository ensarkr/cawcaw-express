import express from "express";
import "dotenv/config";
import { auth } from "../api/auth/auth.js";
import { profile } from "../api/profile/profile.js";

const app = express();

app.use(auth);
app.use(profile);

app.get("/api/test", (req, res) => {
  res.json({ test: "success" }).status(200).end();
});

export { app };
