import "dotenv/config";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { convertDatabaseCommentsToNormal, convertDatabasePostToNormal, convertDatabasePostsToNormal, convertDatabaseUserToNormal, convertDatabaseUsersToNormal, convertDateToDatabase, } from "./conversion.js";
const logDatabaseError = true;
async function createUser(displayName, username, password) {
    try {
        await sql `INSERT INTO cawcaw_users (display_name, username, hashed_password,description) 
    VALUES (${displayName},${username}, ${await bcrypt.hash(password, 10)},${""})`;
        return { status: true };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
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
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function updateUser(userId, displayName, username, description) {
    try {
        await sql `UPDATE cawcaw_users
      SET username = ${username}, display_name = ${displayName}, description = ${description}
      WHERE id = ${userId}`;
        return { status: true };
    }
    catch (e) {
        if (logDatabaseError)
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
        if (logDatabaseError)
            console.log(e);
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
        if (logDatabaseError)
            console.log(e);
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
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function createPost(userId, text, imageUrl, aspectRatio) {
    try {
        const res = await sql `INSERT INTO cawcaw_posts (user_id, text, image_url, aspect_ratio)
     VALUES (${userId}, ${text}, ${imageUrl},${aspectRatio}) RETURNING id`;
        return { status: true, value: { postId: res.rows[0].id } };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
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
        if (logDatabaseError)
            console.log(e);
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
        if (logDatabaseError)
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
        const res = await sql `DELETE FROM cawcaw_post_likes WHERE user_id = ${userId} AND post_id = ${postId}
      RETURNING id;`;
        if (res.rowCount === 0)
            return {
                status: false,
                message: "Already unliked.",
            };
        return { status: true };
    }
    catch (e) {
        if (logDatabaseError)
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
     VALUES (${userId}, ${postId}, ${comment}) `;
        return { status: true };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
const rowPerPage = 10;
async function getLatestPosts(date, page, userId) {
    try {
        let dbResponse = userId !== undefined
            ? await sql `SELECT COUNT(*) as count 
      FROM cawcaw_posts as posts 
      LEFT JOIN (SELECT * FROM cawcaw_users) as users on posts.user_id = users.id
      LEFT JOIN (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId} ) as likes on posts.id = likes.post_id 
      WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp`
            : await sql `SELECT COUNT(*) as count
      FROM cawcaw_posts as posts 
      LEFT JOIN (SELECT * FROM cawcaw_users) as users on posts.user_id = users.id
      WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            userId !== undefined
                ? await sql `SELECT posts.* , users.username, users.display_name ,likes.id IS NOT NULL requested_liked  
    FROM cawcaw_posts as posts 
    LEFT JOIN (SELECT * FROM cawcaw_users) as users on posts.user_id = users.id
    LEFT JOIN (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId} ) as likes on posts.id = likes.post_id 
    WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
    ORDER BY posts.inserted_at DESC
    LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`
                : await sql `SELECT posts.* , users.username, users.display_name 
    FROM cawcaw_posts as posts 
    LEFT JOIN (SELECT * FROM cawcaw_users) as users on posts.user_id = users.id
    WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
    ORDER BY posts.inserted_at DESC
    LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                posts: convertDatabasePostsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function getFollowingPosts(userId, date, page) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) count FROM cawcaw_posts posts 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) follow on posts.user_id = follow.follows_id 
    JOIN (SELECT id,username, display_name FROM cawcaw_users) users on posts.user_id = users.id
    LEFT JOIN (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId}) likes on posts.id = likes.post_id 
    WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
    `;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            await sql `SELECT posts.*, users.username, users.display_name , likes IS NOT NULL requested_liked FROM cawcaw_posts posts 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) follow on posts.user_id = follow.follows_id 
    JOIN (SELECT id,username, display_name FROM cawcaw_users) users on posts.user_id = users.id
    LEFT JOIN (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId}) likes on posts.id = likes.post_id 
    WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
    ORDER BY posts.inserted_at DESC
    LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                posts: convertDatabasePostsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function searchPosts(searchQuery, date, page, requestedUserId) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM cawcaw_posts 
      WHERE search @@ websearch_to_tsquery(${searchQuery})
      AND inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            requestedUserId !== undefined
                ? await sql `SELECT posts.*, users.display_name, users.username, 
      (EXISTS (SELECT * FROM cawcaw_post_likes likes WHERE likes.user_id = ${requestedUserId} AND likes.post_id = posts.id)) requested_liked
      FROM cawcaw_posts posts
      JOIN cawcaw_users users ON users.id = posts.user_id
      WHERE posts.search @@ websearch_to_tsquery(${searchQuery})
      AND posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
      ORDER BY posts.inserted_at DESC
      LIMIT ${10} OFFSET ${rowPerPage * page}`
                : await sql `SELECT posts.*, users.display_name, users.username
      FROM cawcaw_posts posts
      JOIN cawcaw_users users ON users.id = posts.user_id
      WHERE posts.search @@ websearch_to_tsquery(${searchQuery})
      AND posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
      ORDER BY posts.inserted_at DESC
      LIMIT ${10} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                posts: convertDatabasePostsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function searchUsers(searchQuery, date, page, requestedUserId) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM cawcaw_users 
      WHERE search @@ websearch_to_tsquery(${searchQuery})
      AND inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            requestedUserId !== undefined
                ? await sql `SELECT users.*,  
      (EXISTS (SELECT * FROM cawcaw_follow_relation follow WHERE follow.user_id = ${requestedUserId} AND follow.follows_id = users.id )) requested_follows
      FROM cawcaw_users users
      WHERE users.search @@ websearch_to_tsquery(${searchQuery})
      AND users.inserted_at <= ${convertDateToDatabase(date)}::timestamp
      ORDER BY users.inserted_at DESC
      LIMIT ${10} OFFSET ${rowPerPage * page}`
                : await sql `SELECT *
      FROM cawcaw_users users 
      WHERE users.search @@ websearch_to_tsquery(${searchQuery})
      AND users.inserted_at <= ${convertDateToDatabase(date)}::timestamp
      ORDER BY users.inserted_at DESC
      LIMIT ${10} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                users: convertDatabaseUsersToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchPublicUser(userId, requesterUserId) {
    try {
        const dbResponse = requesterUserId !== undefined
            ? await sql `SELECT single_user.*, follow IS NOT NULL requested_follows FROM 
        (SELECT * FROM cawcaw_users WHERE id = ${userId}) single_user 
        LEFT JOIN (SELECT * FROM cawcaw_follow_relation 
        WHERE ${requesterUserId} = user_id AND ${userId} = follows_id) follow 
        ON single_user.id = follow.follows_id`
            : await sql `SELECT * FROM cawcaw_users WHERE id = ${userId}`;
        if (dbResponse.rowCount === 0)
            return { status: false, message: "User not found." };
        const user = dbResponse.rows[0];
        return { status: true, value: convertDatabaseUserToNormal(user) };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchUserFollowers(userId, date, page, requestedUserId) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM cawcaw_users 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE follows_id = ${userId}) as followers_table
    ON cawcaw_users.id = followers_table.follows_id AND followers_table.inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            requestedUserId !== undefined
                ? await sql `SELECT cawcaw_users.*, 
        (EXISTS (SELECT * FROM cawcaw_follow_relation WHERE user_id = ${requestedUserId} 
        AND follows_id = cawcaw_users.id)) requested_follows  
        FROM cawcaw_users 
        JOIN (SELECT * FROM cawcaw_follow_relation WHERE follows_id = ${userId}) as followers_table
        ON cawcaw_users.id = followers_table.user_id
        WHERE followers_table.inserted_at <= ${convertDateToDatabase(date)}::timestamp
        ORDER BY followers_table.inserted_at DESC
        LIMIT ${10} OFFSET ${rowPerPage * page}`
                : await sql `SELECT cawcaw_users.*
        FROM cawcaw_users 
        JOIN (SELECT * FROM cawcaw_follow_relation WHERE follows_id = ${userId}) as followers_table
        ON cawcaw_users.id = followers_table.user_id
        WHERE followers_table.inserted_at <= ${convertDateToDatabase(date)}::timestamp
        ORDER BY followers_table.inserted_at DESC
        LIMIT ${10} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                users: convertDatabaseUsersToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchUserFollowings(userId, date, page, requestedUserId) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM cawcaw_users 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE user_id = ${userId}) as followers_table
    ON cawcaw_users.id = followers_table.follows_id AND followers_table.inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            requestedUserId !== undefined
                ? await sql `SELECT cawcaw_users.*, 
        (EXISTS (SELECT * FROM cawcaw_follow_relation WHERE user_id = ${requestedUserId} 
        AND follows_id = cawcaw_users.id)) requested_follows  
        FROM cawcaw_users 
        JOIN (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) as followings_table
        ON cawcaw_users.id = followings_table.follows_id
        WHERE followings_table.inserted_at <= ${convertDateToDatabase(date)}::timestamp
        ORDER BY followings_table.inserted_at DESC
        LIMIT ${10} OFFSET ${rowPerPage * page}`
                : await sql `SELECT cawcaw_users.*
        FROM cawcaw_users 
        JOIN (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) as followings_table
        ON cawcaw_users.id = followings_table.follows_id
        WHERE followings_table.inserted_at <= ${convertDateToDatabase(date)}::timestamp
        ORDER BY followings_table.inserted_at DESC
        LIMIT ${10} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                users: convertDatabaseUsersToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchUserPosts(userId, date, page, requesterUserId) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM cawcaw_posts 
      WHERE user_id = ${userId}  AND inserted_at < ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            requesterUserId !== undefined
                ? await sql `SELECT posts.* , users.username, users.display_name ,likes.id IS NOT NULL requested_liked  
      FROM cawcaw_posts as posts 
      LEFT JOIN (SELECT * FROM cawcaw_users) as users on posts.user_id = users.id
      LEFT JOIN (SELECT * FROM cawcaw_post_likes WHERE user_id = ${requesterUserId} ) as likes on posts.id = likes.post_id 
      WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp 
      AND posts.user_id = ${userId}
      ORDER BY posts.inserted_at DESC
      LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`
                : await sql `SELECT posts.* , users.username, users.display_name 
      FROM cawcaw_posts as posts 
      LEFT JOIN (SELECT * FROM cawcaw_users) as users on posts.user_id = users.id
      WHERE posts.inserted_at <= ${convertDateToDatabase(date)}::timestamp
      AND posts.user_id = ${userId}
      ORDER BY posts.inserted_at DESC
      LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                posts: convertDatabasePostsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchUserComments(userId, date, page) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM cawcaw_post_comments
      WHERE user_id = ${userId}  AND inserted_at < ${convertDateToDatabase(date)}`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            await sql `SELECT cawcaw_post_comments.*, cawcaw_users.username, cawcaw_users.display_name FROM cawcaw_post_comments 
      LEFT JOIN cawcaw_users ON cawcaw_users.id = cawcaw_post_comments.user_id 
      WHERE user_id = ${userId}  
      AND cawcaw_post_comments.inserted_at <= ${convertDateToDatabase(date)}::timestamp 
      ORDER BY cawcaw_post_comments.inserted_at DESC
      LIMIT ${10} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                comments: convertDatabaseCommentsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchUserLikes(userId, date, page, requesterUserId) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) count FROM cawcaw_post_likes WHERE user_id = ${userId}
      AND inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            requesterUserId !== undefined
                ? await sql `SELECT posts.* , users.username, users.display_name, 
        (EXISTS (SELECT * FROM cawcaw_post_likes rl WHERE rl.post_id = posts.id AND rl.user_id = ${requesterUserId})) requested_liked   
      FROM (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId}) likes 
      JOIN cawcaw_posts posts ON posts.id = likes.post_id
      JOIN cawcaw_users users ON posts.user_id = users.id
      WHERE likes.inserted_at <= ${convertDateToDatabase(date)}::timestamp 
      ORDER BY likes.inserted_at DESC
      LIMIT ${rowPerPage} OFFSET ${rowPerPage * page} `
                : await sql `SELECT posts.* , users.username, users.display_name 
      FROM (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId}) likes 
      JOIN cawcaw_posts posts ON posts.id = likes.post_id
      JOIN cawcaw_users users ON posts.user_id = users.id
      WHERE likes.inserted_at <= ${convertDateToDatabase(date)}::timestamp 
      ORDER BY likes.inserted_at DESC
      LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                posts: convertDatabasePostsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchPostComments(postId, date, page) {
    try {
        let dbResponse = await sql `SELECT COUNT(*) as count FROM 
      (SELECT * FROM cawcaw_post_comments WHERE post_id = ${postId}) comments 
    JOIN (SELECT id,display_name,username FROM cawcaw_users) users on users.id = comments.user_id 
    WHERE inserted_at <= ${convertDateToDatabase(date)}::timestamp`;
        const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);
        if (page > pageCount - 1) {
            return { status: false, message: "Page does not exist." };
        }
        dbResponse =
            await sql `SELECT comments.*, users.display_name, users.username FROM 
    (SELECT * FROM cawcaw_post_comments WHERE post_id = ${postId}) comments 
    JOIN (SELECT id,display_name,username FROM cawcaw_users) users on users.id = comments.user_id 
    WHERE inserted_at <= ${convertDateToDatabase(date)}::timestamp 
    ORDER BY comments.inserted_at DESC
    LIMIT ${rowPerPage} OFFSET ${rowPerPage * page}`;
        return {
            status: true,
            value: {
                comments: convertDatabaseCommentsToNormal(dbResponse.rows),
                pageCount,
            },
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
async function fetchPost(userId, postId) {
    try {
        const dbResponse = userId !== undefined
            ? await sql `SELECT posts.* , users.username, users.display_name, likes.id IS NOT NULL requested_liked 
      FROM (SELECT * FROM cawcaw_posts posts WHERE id = ${postId}) posts 
      JOIN (SELECT id,username, display_name FROM cawcaw_users) users on users.id = posts.user_id
      LEFT JOIN (SELECT * FROM cawcaw_post_likes WHERE user_id = ${userId}) likes on likes.post_id = posts.id`
            : await sql `SELECT posts.* , users.username, users.display_name
      FROM (SELECT * FROM cawcaw_posts posts WHERE id = ${postId}) posts 
      JOIN (SELECT id,username, display_name FROM cawcaw_users) users on users.id = posts.user_id`;
        if (dbResponse.rowCount === 0)
            return { status: false, message: "Post not found." };
        const post = dbResponse.rows[0];
        return {
            status: true,
            value: convertDatabasePostToNormal(post),
        };
    }
    catch (e) {
        if (logDatabaseError)
            console.log(e);
        return {
            status: false,
            message: "Database error occurred.",
        };
    }
}
export { createUser, fetchUser, updateUser, updatePassword, followUser, unfollowUser, createPost, removePost, likePost, unlikePost, commentOnPost, getLatestPosts, getFollowingPosts, searchPosts, searchUsers, fetchPublicUser, fetchUserFollowers, fetchUserFollowings, fetchUserPosts, fetchUserComments, fetchUserLikes, fetchPostComments, fetchPost, };
