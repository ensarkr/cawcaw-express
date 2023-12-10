import express from "express";
import "dotenv/config";
import { auth } from "./auth/auth.js";
import { profile } from "./profile/profile.js";

const app = express();
const port = 5000;

app.use(auth);
app.use(profile);

app.get("/api/test", (req, res) => {
  res.json({ test: "success" }).status(200).end();
});

app.listen(port, () => {
  console.log("cawcaw-express listening on " + port);
});
