import express from "express";
import "dotenv/config";
import { getPostsQuery, getPostsResponse } from "../../typings/http.js";
import { getFollowingPosts, getLatestPosts } from "../../functions/database.js";
import { validateJWT_MW } from "../../middlewares/jwt.js";

const data = express();

data.get("/api/data/posts/explore", async (req, res) => {
  if (req.query.endDate === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "endDate query must be defined.",
      } as getPostsResponse)
      .end();
    return;
  }

  if (req.query.page === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "page query must be defined.",
      } as getPostsResponse)
      .end();
    return;
  }

  const queries: getPostsQuery = {
    page: parseInt(req.query.page as string),
    endDate: new Date(req.query.endDate as string),
  };

  const dbResponse = await getLatestPosts(queries.endDate, queries.page);

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getPostsResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getPostsResponse)
      .end();
  }
  return;
});

data.get("/api/data/posts/following", validateJWT_MW, async (req, res) => {
  if (req.query.endDate === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "endDate query must be defined.",
      } as getPostsResponse)
      .end();
    return;
  }

  if (req.query.page === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "page query must be defined.",
      } as getPostsResponse)
      .end();
    return;
  }

  const queries: getPostsQuery = {
    page: parseInt(req.query.page as string),
    endDate: new Date(req.query.endDate as string),
  };

  const dbResponse = await getFollowingPosts(
    res.locals.userId,
    queries.endDate,
    queries.page
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getPostsResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getPostsResponse)
      .end();
  }
  return;
});

export { data };
