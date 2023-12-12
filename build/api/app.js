import express from "express";
import "dotenv/config";
import { auth } from "../api/auth/auth.js";
import { profile } from "../api/profile/profile.js";
import { action } from "./action/action.js";
import { post } from "./post/post.js";
import { data } from "./data/data.js";
const app = express();
app.use(auth);
app.use(profile);
app.use(action);
app.use(post);
app.use(data);
app.get("/api/test", (req, res) => {
    res.json({ test: "success" }).status(200).end();
});
export { app };
