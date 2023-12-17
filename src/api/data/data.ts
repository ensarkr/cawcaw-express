import express from "express";
import "dotenv/config";
import {
  getCommentsResponse,
  getPostResponse,
  getPageQuery,
  getPostsResponse,
  getUserResponse,
  getUsersResponse,
  searchPostsQuery,
} from "../../typings/http.js";
import {
  fetchPost,
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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Explore posts requested, endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Following posts requested, endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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

    console.log(
      "Search posts requested, endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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

    console.log(
      "Search users requested, endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
  console.log("User requested, requested id: " + req.params.id);

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Users followers requested, requested id: " +
        req.params.id +
        " endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Users followings requested, requested id: " +
        req.params.id +
        " endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Users posts requested, requested id: " +
        req.params.id +
        " endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Users likes requested, requested id: " +
        req.params.id +
        " endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Users comments requested, requested id: " +
        req.params.id +
        " endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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
    const queries: getPageQuery = {
      page: parseInt(req.query.page as string),
      endDate: new Date(req.query.endDate as string),
    };

    console.log(
      "Posts comments requested, requested id: " +
        req.params.id +
        " endDate: " +
        queries.endDate +
        " page: " +
        queries.page
    );

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

data.get("/api/data/post/:id", async (req, res) => {
  const dbResponse = await fetchPost(parseInt(req.params.id));

  console.log("Post requested, requested id: " + req.params.id);

  if (dbResponse.status) {
    res
      .status(200)
      .json({
        status: true,
        value: dbResponse.value,
      } as getPostResponse)
      .end();
  } else {
    res
      .status(400)
      .json({
        status: false,
        message: dbResponse.message,
      } as getPostResponse)
      .end();
  }
  return;
});

export { data };
