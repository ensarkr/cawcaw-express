import express from "express";
import "dotenv/config";
import { validateResponseBody } from "../functions/validation.js";
import { createUser, fetchUser } from "../functions/database.js";
import { createJWT } from "../functions/jwt.js";
const auth = express();
auth.use(express.json());
auth.post("/api/auth/signUp", async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, [
        "displayName",
        "username",
        "password",
        "rePassword",
    ])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    if (body.password !== body.rePassword) {
        res
            .status(400)
            .json({
            status: false,
            message: "Passwords do not match.",
        })
            .end();
        return;
    }
    const dbResponse = await createUser(body.displayName, body.username, body.password);
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
auth.post("/api/auth/signIn", async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["username", "password"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    const dbResponse = await fetchUser(body.username, body.password);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: createJWT(dbResponse.value),
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
export { auth };
