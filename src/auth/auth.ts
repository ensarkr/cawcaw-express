import express, { json } from "express";
import "dotenv/config";
import { validateResponseBody } from "../functions/validation.js";
import { signInRequestBody, signUpRequestBody } from "../typings/http.js";
import { createUser, fetchUser } from "../functions/database.js";
import { createJWT } from "../functions/jwt.js";

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

auth.post("/api/auth/signIn", async (req, res) => {
  const body: signInRequestBody = req.body;

  if (!validateResponseBody(body, ["username", "password"])) {
    res.status(400).end();
    return;
  }

  const dbResponse = await fetchUser(body.username, body.password);

  if (dbResponse.status) {
    res
      .status(200)
      .json({ message: "Success.", jwtToken: createJWT(dbResponse.value) })
      .end();
  } else {
    res.status(400).json({ message: dbResponse.message }).end();
  }
  return;
});

export { auth };
