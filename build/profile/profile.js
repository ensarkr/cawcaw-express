import express from "express";
import "dotenv/config";
import { validateResponseBody } from "../functions/validation.js";
import { validateJWT_MW } from "../middlewares/jwt.js";
import { updatePassword, updateUser } from "../functions/database.js";
import { createJWT } from "../functions/jwt.js";
const profile = express();
profile.use(express.json());
profile.post("/api/profile/edit", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["displayName", "username", "description"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    const dbResponse = await updateUser(res.locals.userId, body.displayName, body.username, body.description);
    if (dbResponse.status) {
        res
            .status(200)
            .json({
            status: true,
            value: createJWT({
                id: res.locals.userId,
                displayName: body.displayName,
                username: body.username,
            }),
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
profile.post("/api/profile/editPassword", validateJWT_MW, async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["oldPassword", "newPassword", "reNewPassword"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    if (body.newPassword !== body.reNewPassword) {
        res
            .status(400)
            .json({
            status: false,
            message: "New passwords do not match.",
        })
            .end();
        return;
    }
    const dbResponse = await updatePassword(res.locals.userId, body.oldPassword, body.newPassword);
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
export { profile };
