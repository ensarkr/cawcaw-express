import express from "express";
import multer from "multer";
import sharp from "sharp";
import "dotenv/config";
import { validateResponseBody } from "../../functions/validation.js";
import { validateJWT_MW } from "../../middlewares/jwt.js";
import { createPost, removePost } from "../../functions/database.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });
const post = express();
post.post("/api/post/create", validateJWT_MW, upload.single("image"), async (req, res) => {
    const body = req.body;
    if (!validateResponseBody(body, ["text", "isThereAnImage"])) {
        res
            .status(400)
            .json({
            status: false,
            message: "Empty inputs.",
        })
            .end();
        return;
    }
    console.log("Post creation requested, user id: " + res.locals.userId);
    if (body.text.length > 250) {
        res
            .status(400)
            .json({
            status: false,
            message: "Text cannot be longer than 250 characters.",
        })
            .end();
        return;
    }
    if ((req.file === undefined) !== (body.isThereAnImage === "no")) {
        res
            .status(400)
            .json({
            status: false,
            message: "Cannot access the image.",
        })
            .end();
        return;
    }
    let fileUrl = null;
    if (req.file) {
        if (!["image/webp", "image/png", "image/jpeg"].includes(req.file.mimetype)) {
            res
                .status(400)
                .json({
                status: false,
                message: "Only webp, png and jpg files are supported.",
            })
                .end();
            return;
        }
        if (req.file.size > 1000000) {
            res
                .status(400)
                .json({
                status: false,
                message: "Image size cannot be bigger than 1MB.",
            })
                .end();
            return;
        }
        const webpBuffer = await sharp(req.file?.buffer)
            .webp({ quality: 100 })
            .toBuffer();
        const dataStream = new Readable();
        dataStream._read = () => { };
        dataStream.push(webpBuffer);
        dataStream.push(null);
        const uploadResult = await new Promise((resolve) => {
            dataStream.pipe(cloudinary.uploader.upload_stream((error, uploadResult) => {
                if (error) {
                    console.log(error);
                    return resolve({ status: false, message: "Cloudinary error." });
                }
                return resolve({
                    status: true,
                    value: uploadResult?.secure_url,
                });
            }));
        });
        if (uploadResult.status) {
            fileUrl = uploadResult.value;
        }
        else {
            res
                .status(400)
                .json({
                status: false,
                message: uploadResult.message,
            })
                .end();
            return;
        }
    }
    const dbResponse = await createPost(res.locals.userId, body.text, fileUrl);
    if (dbResponse.status) {
        res.status(200).end();
        return;
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
            .end();
        return;
    }
});
post.use(express.json());
post.post("/api/post/remove", validateJWT_MW, async (req, res) => {
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
    console.log("Post deletion requested, user id: " + res.locals.userId);
    const dbResponse = await removePost(res.locals.userId, body.postId);
    if (dbResponse.status) {
        res.status(200).end();
        return;
    }
    else {
        res
            .status(400)
            .json({
            status: false,
            message: dbResponse.message,
        })
            .end();
        return;
    }
});
export { post };
