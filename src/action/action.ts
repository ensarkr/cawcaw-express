import express from "express";
import "dotenv/config";
import { validateResponseBody } from "../functions/validation.js";
import {
  followUserRequestBody,
  followUserResponseBody,
  unfollowUserRequestBody,
  unfollowUserResponseBody,
} from "../typings/http.js";
import { followUser, unfollowUser } from "../functions/database.js";
import { validateJWT_MW } from "../middlewares/jwt.js";

const action = express();
action.use(express.json());

action.post("/api/action/follow", validateJWT_MW, async (req, res) => {
  const body: followUserRequestBody = req.body;

  if (!validateResponseBody(body, ["targetId"])) {
    res
      .status(400)
      .json({
        status: false,
        message: "Empty inputs.",
      } as followUserResponseBody)
      .end();
    return;
  }

  const dbResponse = await followUser(
    res.locals.userId as number,
    body.targetId
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
      } as followUserResponseBody)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as followUserResponseBody)
      .end();
  }
  return;
});

action.post("/api/action/unfollow", validateJWT_MW, async (req, res) => {
  const body: unfollowUserRequestBody = req.body;

  if (!validateResponseBody(body, ["targetId"])) {
    res
      .status(400)
      .json({
        status: false,
        message: "Empty inputs.",
      } as unfollowUserResponseBody)
      .end();
    return;
  }

  const dbResponse = await unfollowUser(
    res.locals.userId as number,
    body.targetId
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
      } as unfollowUserResponseBody)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as unfollowUserResponseBody)
      .end();
  }
  return;
});

export { action };
