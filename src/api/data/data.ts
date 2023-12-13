import express from "express";
import "dotenv/config";
import {
  getCommentsResponse,
  getPostsQuery,
  getPostsResponse,
  getUserResponse,
  getUsersResponse,
  searchPostsQuery,
} from "../../typings/http.js";
import {
  fetchPostComments,
  fetchPublicUser,
  fetchUserComments,
  fetchUserFollowers,
  fetchUserFollowings,
  fetchUserLikes,
  fetchUserPosts,
  getFollowingPosts,
  getLatestPosts,
  searchPosts,
  searchUsers,
} from "../../functions/database.js";
import { validateJWT_MW } from "../../middlewares/jwt.js";
import { checkQueries_MW } from "../../middlewares/checkQueries.js";

const data = express();

data.get(
  "/api/data/posts/explore",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
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
  }
);

data.get(
  "/api/data/posts/following",
  validateJWT_MW,
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
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
  }
);

data.get(
  "/api/data/posts/search",
  checkQueries_MW(["endDate", "page", "searchQuery"]),
  async (req, res) => {
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
  }
);

data.get(
  "/api/data/users/search",
  checkQueries_MW(["endDate", "page", "searchQuery"]),
  async (req, res) => {
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
  }
);

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

data.get(
  "/api/data/user/:id/followers",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
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
  }
);

data.get(
  "/api/data/user/:id/followings",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
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
  }
);

data.get(
  "/api/data/user/:id/posts",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
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
  }
);

data.get(
  "/api/data/user/:id/likes",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
    const queries: getPostsQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    const dbResponse = await fetchUserLikes(
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
  }
);

data.get(
  "/api/data/user/:id/comments",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
    const queries: getPostsQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    const dbResponse = await fetchUserComments(
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
        } as getCommentsResponse)
        .end();
    } else {
      res
        .status(400)
        .json({
          status: false,
          message: dbResponse.message,
        } as getCommentsResponse)
        .end();
    }
    return;
  }
);

data.get(
  "/api/data/post/:id/comments",
  checkQueries_MW(["endDate", "page"]),
  async (req, res) => {
    const queries: getPostsQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    const dbResponse = await fetchPostComments(
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
        } as getCommentsResponse)
        .end();
    } else {
      res
        .status(400)
        .json({
          status: false,
          message: dbResponse.message,
        } as getCommentsResponse)
        .end();
    }
    return;
  }
);

export { data };
