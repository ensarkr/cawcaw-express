import express from "express";
import "dotenv/config";
import { fetchPublicUser, fetchUserFollowers, fetchUserFollowings, fetchUserPosts, getFollowingPosts, getLatestPosts, searchPosts, searchUsers, } from "../../functions/database.js";
import { validateJWT_MW } from "../../middlewares/jwt.js";
const data = express();
data.get("/api/data/posts/explore", async (req, res) => {
    if (req.query.endDate === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "endDate query must be defined.",
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
    };
    const dbResponse = await getLatestPosts(queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
    };
    const dbResponse = await getFollowingPosts(res.locals.userId, queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    if (req.query.searchQuery === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "searchQuery query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
        searchQuery: req.query.searchQuery,
    };
    const dbResponse = await searchPosts(queries.searchQuery, queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    if (req.query.searchQuery === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "searchQuery query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
        searchQuery: req.query.searchQuery,
    };
    const dbResponse = await searchUsers(queries.searchQuery, queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
    };
    const dbResponse = await fetchUserFollowers(parseInt(req.params.id), queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
    };
    const dbResponse = await fetchUserFollowings(parseInt(req.params.id), queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
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
        })
            .end();
        return;
    }
    if (req.query.page === undefined) {
        res
            .status(400)
            .json({
            status: false,
            message: "page query must be defined.",
        })
            .end();
        return;
    }
    const queries = {
        page: parseInt(req.query.page),
        endDate: new Date(req.query.endDate),
    };
    const dbResponse = await fetchUserPosts(parseInt(req.params.id), queries.endDate, queries.page);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: dbResponse.value,
        })
            .end();
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
            .end();
    }
    return;
});
export { data };
