import express from "express";
import "dotenv/config";
import {
  getPostsQuery,
  getPostsResponse,
  getUserResponse,
  getUsersResponse,
  searchPostsQuery,
} from "../../typings/http.js";
import {
  fetchPublicUser,
  fetchUserFollowers,
  fetchUserFollowings,
  fetchUserPosts,
  getFollowingPosts,
  getLatestPosts,
  searchPosts,
  searchUsers,
} from "../../functions/database.js";
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

data.get("/api/data/posts/search", async (req, res) => {
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

  if (req.query.searchQuery === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "searchQuery query must be defined.",
      } as getPostsResponse)
      .end();
    return;
  }

  const queries: searchPostsQuery = {
    page: parseInt(req.query.page as string),
    endDate: new Date(req.query.endDate as string),
    searchQuery: req.query.searchQuery as string,
  };

  const dbResponse = await searchPosts(
    queries.searchQuery,
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

data.get("/api/data/users/search", async (req, res) => {
  if (req.query.endDate === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "endDate query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  if (req.query.page === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "page query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  if (req.query.searchQuery === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "searchQuery query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  const queries: searchPostsQuery = {
    page: parseInt(req.query.page as string),
    endDate: new Date(req.query.endDate as string),
    searchQuery: req.query.searchQuery as string,
  };

  const dbResponse = await searchUsers(
    queries.searchQuery,
    queries.endDate,
    queries.page
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getUsersResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getUsersResponse)
      .end();
  }
  return;
});

data.get("/api/data/user/:id", async (req, res) => {
  const dbResponse = await fetchPublicUser(parseInt(req.params.id));

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getUserResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getUserResponse)
      .end();
  }
  return;
});

data.get("/api/data/user/:id/followers", async (req, res) => {
  if (req.query.endDate === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "endDate query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  if (req.query.page === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "page query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  const queries: getPostsQuery = {
    page: parseInt(req.query.page as string),
    endDate: new Date(req.query.endDate as string),
  };

  const dbResponse = await fetchUserFollowers(
    parseInt(req.params.id),
    queries.endDate,
    queries.page
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getUsersResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getUsersResponse)
      .end();
  }
  return;
});

data.get("/api/data/user/:id/followings", async (req, res) => {
  if (req.query.endDate === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "endDate query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  if (req.query.page === undefined) {
    res
      .status(400)
      .json({
        status: false,
        message: "page query must be defined.",
      } as getUsersResponse)
      .end();
    return;
  }

  const queries: getPostsQuery = {
    page: parseInt(req.query.page as string),
    endDate: new Date(req.query.endDate as string),
  };

  const dbResponse = await fetchUserFollowings(
    parseInt(req.params.id),
    queries.endDate,
    queries.page
  );

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getUsersResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getUsersResponse)
      .end();
  }
  return;
});

data.get("/api/data/user/:id/posts", async (req, res) => {
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

  const dbResponse = await fetchUserPosts(
    parseInt(req.params.id),
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
