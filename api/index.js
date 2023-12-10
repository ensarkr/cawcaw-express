import express from "express";
import "dotenv/config";
import { app } from "../build/api/app.js";

const main = express();
const port = 5000;

main.use(app);

main.listen(port, () => {
  console.log("cawcaw-express listening on " + port);
});
