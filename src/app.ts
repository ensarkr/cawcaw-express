import express from "express";
import "dotenv/config";

const app = express();
const port = 5000;

app.get("/api/test", (req, res) => {
  res.json({ test: "success" }).status(200).end();
});

app.listen(port, () => {
  console.log("cawcaw-express listening on " + port);
});
