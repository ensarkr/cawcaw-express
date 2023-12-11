import express from "express";
import "dotenv/config";
import { validateResponseBody } from "../../functions/validation.js";
import { commentOnPost, followUser, likePost, unfollowUser, unlikePost, } from "../../functions/database.js";
import { validateJWT_MW } from "../../middlewares/jwt.js";
const action = express();
action.use(express.json());
action.post("/api/action/follow", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["targetId"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    const dbResponse = await followUser(res.locals.userId, body.targetId);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
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
action.post("/api/action/unfollow", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["targetId"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    const dbResponse = await unfollowUser(res.locals.userId, body.targetId);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
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
action.post("/api/action/like", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["postId"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    const dbResponse = await likePost(res.locals.userId, body.postId);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
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
action.post("/api/action/unlike", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["postId"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    const dbResponse = await unlikePost(res.locals.userId, body.postId);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
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
action.post("/api/action/comment", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["postId", "comment"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    if (body.comment.length > 180) {
        res
            .status(400)
            .json({
            status: false,
            message: "Comment cannot be longer than 180 characters.",
        })
            .end();
        return;
    }
    const dbResponse = await commentOnPost(res.locals.userId, body.postId, body.comment);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
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
export { action };
