import express from "express";
import "dotenv/config";
import { validateResponseBody } from "../../functions/validation.js";
import {
  commentOnPostRequestBody,
  commentOnPostResponseBody,
  followUserRequestBody,
  followUserResponseBody,
  likePostRequestBody,
  likePostResponseBody,
  unfollowUserRequestBody,
  unfollowUserResponseBody,
  unlikePostRequestBody,
  unlikePostResponseBody,
} from "../../typings/http.js";
import {
  commentOnPost,
  followUser,
  likePost,
  unfollowUser,
  unlikePost,
} from "../../functions/database.js";
import { validateJWT_MW } from "../../middlewares/jwt.js";

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

action.post("/api/action/like", validateJWT_MW, async (req, res) => {
  const body: likePostRequestBody = req.body;

  if (!validateResponseBody(body, ["postId"])) {
    res
      .status(400)
      .json({
        status: false,
        message: "Empty inputs.",
      } as likePostResponseBody)
      .end();
    return;
  }

  const dbResponse = await likePost(res.locals.userId as number, body.postId);

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
      } as likePostResponseBody)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as likePostResponseBody)
      .end();
  }
  return;
});

action.post("/api/action/unlike", validateJWT_MW, async (req, res) => {
  const body: unlikePostRequestBody = req.body;

  if (!validateResponseBody(body, ["postId"])) {
    res
      .status(400)
      .json({
        status: false,
        message: "Empty inputs.",
      } as unlikePostResponseBody)
      .end();
    return;
  }

  const dbResponse = await unlikePost(res.locals.userId as number, body.postId);

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
      } as unlikePostResponseBody)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as unlikePostResponseBody)
      .end();
  }
  return;
});

action.post("/api/action/comment", validateJWT_MW, async (req, res) => {
  const body: commentOnPostRequestBody = req.body;

  if (!validateResponseBody(body, ["postId", "comment"])) {
    res
      .status(400)
      .json({
        status: false,
        message: "Empty inputs.",
      } as commentOnPostResponseBody)
      .end();
    return;
  }

  if (body.comment.length > 180) {
    res
      .status(400)
      .json({
        status: false,
        message: "Comment cannot be longer than 180 characters.",
      } as commentOnPostResponseBody)
      .end();
    return;
  }

  const dbResponse = await commentOnPost(
    res.locals.userId,
    body.postId,
    body.comment
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
      } as commentOnPostResponseBody)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as commentOnPostResponseBody)
      .end();
  }
  return;
});

export { action };
