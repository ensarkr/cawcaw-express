import "dotenv/config";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
async function createUser(displayName, username, password) {
    try {
        await sql `INSERT INTO cawcaw_users (display_name, username, hashed_password,description) 
    VALUES (${displayName},${username}, ${await bcrypt.hash(password, 10)},${""})`;
        return { status: true };
    }
    catch (e) {
        return {
            status: false,
            message: e.message.includes("duplicate key")
                ? "This username cannot be used."
                : "Database error occurred.",
        };
    }
}
async function fetchUser(username, password) {
    try {
        const dbResponse = await sql `SELECT * FROM cawcaw_users WHERE username = ${username}`;
        if (dbResponse.rowCount === 0)
            return { status: false, message: "Wrong username or password." };
        const user = dbResponse.rows[0];
        if (!(await bcrypt.compare(password, user.hashed_password)))
            return { status: false, message: "Wrong username or password." };
        return { status: true, value: convertDatabaseUserToNormal(user) };
    }
    catch (e) {
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
function convertDatabaseUserToNormal(user) {
    return {
        id: user.id,
        displayName: user.display_name,
        username: user.username,
        description: user.description,
        followersCount: user.followers_count,
        followingCount: user.following_count,
    };
}
async function updateUser(userId, displayName, username, description) {
    try {
        await sql `UPDATE cawcaw_users
      SET username = ${username}, display_name = ${displayName}, description = ${description}
      WHERE id = ${userId}`;
        return { status: true };
    }
    catch (e) {
        console.log(e);
        return {
            status: false,
            message: e.message.includes("duplicate key")
                ? "This username cannot be used."
                : "Database error occurred.",
        };
    }
}
async function updatePassword(userId, oldPassword, newPassword) {
    try {
        const dbResponseResponse = await sql `SELECT hashed_password FROM cawcaw_users
      WHERE id = ${userId}`;
        if (!(await bcrypt.compare(oldPassword, dbResponseResponse.rows[0].hashed_password)))
            return { status: false, message: "Wrong password." };
        await sql `UPDATE cawcaw_users
      SET hashed_password = ${await bcrypt.hash(newPassword, 10)}
      WHERE id = ${userId}`;
        return { status: true };
    }
    catch (e) {
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function followUser(userId, targetId) {
    try {
        await sql `INSERT INTO cawcaw_follow_relation (user_id,follows_id) 
    VALUES (${userId},${targetId})`;
        return { status: true };
    }
    catch (e) {
        return {
            status: false,
            message: e.message.includes("duplicate")
                ? "Already following."
                : "Database error occurred.",
        };
    }
}
async function unfollowUser(userId, targetId) {
    try {
        await sql `DELETE FROM cawcaw_follow_relation WHERE user_id = ${userId} AND follows_id = ${targetId}`;
        return { status: true };
    }
    catch (e) {
        console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function createPost(userId, text, imageUrl) {
    try {
        await sql `INSERT INTO cawcaw_posts (user_id, text, image_url)
     VALUES (${userId}, ${text}, ${imageUrl})`;
        return { status: true };
    }
    catch (e) {
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function removePost(userId, postId) {
    try {
        const dbCheck = await sql `SELECT * FROM cawcaw_posts WHERE id = ${postId} AND user_id = ${userId}`;
        if (dbCheck.rowCount === 0) {
            return {
                status: false,
                message: "Post does not exist.",
            };
        }
        await sql `DELETE FROM cawcaw_posts WHERE id = ${postId} AND user_id = ${userId}`;
        return { status: true };
    }
    catch (e) {
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function likePost(userId, postId) {
    try {
        await sql `INSERT INTO cawcaw_post_likes (user_id,post_id) 
    VALUES (${userId},${postId})`;
        return { status: true };
    }
    catch (e) {
        console.log(e);
        return {
            status: false,
            message: e.message.includes("duplicate")
                ? "Already liked."
                : "Database error occurred.",
        };
    }
}
async function unlikePost(userId, postId) {
    try {
        await sql `DELETE FROM cawcaw_post_likes WHERE user_id = ${userId} AND post_id = ${postId}`;
        return { status: true };
    }
    catch (e) {
        console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function commentOnPost(userId, postId, comment) {
    try {
        await sql `INSERT INTO cawcaw_post_comments (user_id, post_id, comment)
     VALUES (${userId}, ${postId}, ${comment});`;
        return { status: true };
    }
    catch (e) {
        console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
export { createUser, fetchUser, updateUser, updatePassword, followUser, unfollowUser, createPost, removePost, likePost, unlikePost, commentOnPost, };
