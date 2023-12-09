import express, { json } from "express";
import "dotenv/config";
import { validateResponseBody } from "../functions/validation.js";
import { signUpRequestBody } from "../typings/http.js";
import { createUser } from "../functions/database.js";

const auth = express();
auth.use(express.json());

auth.post("/api/auth/signUp", async (req, res) => {
  const body: signUpRequestBody = req.body;

  if (
    !validateResponseBody(body, [
      "displayName",
      "username",
      "password",
      "rePassword",
    ])
  ) {
    res.status(400).end();
    return;
  }

  if (body.password !== body.rePassword) {
    res.status(400).json({ message: "Passwords do not match." }).end();
    return;
  }

  const dbResponse = await createUser(
    body.displayName,
    body.username,
    body.password
  );

  if (dbResponse.status) {
    res.status(200).end();
  } else {
    res.status(400).json({ message: dbResponse.message }).end();
  }
  return;
});

export { auth };
