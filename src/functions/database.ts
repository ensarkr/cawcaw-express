import "dotenv/config";
import { db, sql } from "@vercel/postgres";
import { doubleReturn } from "../typings/global.js";
import bcrypt from "bcrypt";
import { post, post_DB, user, user_DB } from "../typings/database.js";
import {
  convertDatabasePostsToNormal,
  convertDatabaseUserToNormal,
  convertDateToDatabase,
} from "./conversion.js";

async function createUser(
  displayName: string,
  username: string,
  password: string
): Promise<doubleReturn<undefined>> {
  try {
    await sql`INSERT INTO cawcaw_users (display_name, username, hashed_password,description) 
    VALUES (${displayName},${username}, ${await bcrypt.hash(
      password,
      10
    )},${""})`;

    return { status: true };
  } catch (e) {
    return {
      status: false,
      message: (e as Error).message.includes("duplicate key")
        ? "This username cannot be used."
        : "Database error occurred.",
    };
  }
}

async function fetchUser(
  username: string,
  password: string
): Promise<doubleReturn<user>> {
  try {
    const dbResponse =
      await sql`SELECT * FROM cawcaw_users WHERE username = ${username}`;

    if (dbResponse.rowCount === 0)
      return { status: false, message: "Wrong username or password." };

    const user = dbResponse.rows[0] as user_DB;

    if (!(await bcrypt.compare(password, user.hashed_password)))
      return { status: false, message: "Wrong username or password." };

    return { status: true, value: convertDatabaseUserToNormal(user) };
  } catch (e) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function updateUser(
  userId: number,
  displayName: string,
  username: string,
  description: string
): Promise<doubleReturn<undefined>> {
  try {
    await sql`UPDATE cawcaw_users
      SET username = ${username}, display_name = ${displayName}, description = ${description}
      WHERE id = ${userId}`;

    return { status: true };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: (e as Error).message.includes("duplicate key")
        ? "This username cannot be used."
        : "Database error occurred.",
    };
  }
}

async function updatePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<doubleReturn<undefined>> {
  try {
    const dbResponseResponse =
      await sql`SELECT hashed_password FROM cawcaw_users
      WHERE id = ${userId}`;

    if (
      !(await bcrypt.compare(
        oldPassword,
        dbResponseResponse.rows[0].hashed_password
      ))
    )
      return { status: false, message: "Wrong password." };

    await sql`UPDATE cawcaw_users
      SET hashed_password = ${await bcrypt.hash(newPassword, 10)}
      WHERE id = ${userId}`;

    return { status: true };
  } catch (e) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function followUser(
  userId: number,
  targetId: number
): Promise<doubleReturn<undefined>> {
  try {
    await sql`INSERT INTO cawcaw_follow_relation (user_id,follows_id) 
    VALUES (${userId},${targetId})`;

    return { status: true };
  } catch (e) {
    return {
      status: false,
      message: (e as Error).message.includes("duplicate")
        ? "Already following."
        : "Database error occurred.",
    };
  }
}

async function unfollowUser(
  userId: number,
  targetId: number
): Promise<doubleReturn<undefined>> {
  try {
    await sql`DELETE FROM cawcaw_follow_relation WHERE user_id = ${userId} AND follows_id = ${targetId}`;

    return { status: true };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function createPost(
  userId: number,
  text: string,
  imageUrl: string | null
): Promise<doubleReturn<undefined>> {
  try {
    await sql`INSERT INTO cawcaw_posts (user_id, text, image_url)
     VALUES (${userId}, ${text}, ${imageUrl})`;

    return { status: true };
  } catch (e) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function removePost(
  userId: number,
  postId: number
): Promise<doubleReturn<undefined>> {
  try {
    const dbCheck =
      await sql`SELECT * FROM cawcaw_posts WHERE id = ${postId} AND user_id = ${userId}`;

    if (dbCheck.rowCount === 0) {
      return {
        status: false,
        message: "Post does not exist.",
      };
    }

    await sql`DELETE FROM cawcaw_posts WHERE id = ${postId} AND user_id = ${userId}`;

    return { status: true };
  } catch (e) {
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function likePost(
  userId: number,
  postId: number
): Promise<doubleReturn<undefined>> {
  try {
    await sql`INSERT INTO cawcaw_post_likes (user_id,post_id) 
    VALUES (${userId},${postId})`;

    return { status: true };
  } catch (e) {
    console.log(e);

    return {
      status: false,
      message: (e as Error).message.includes("duplicate")
        ? "Already liked."
        : "Database error occurred.",
    };
  }
}

async function unlikePost(
  userId: number,
  postId: number
): Promise<doubleReturn<undefined>> {
  try {
    await sql`DELETE FROM cawcaw_post_likes WHERE user_id = ${userId} AND post_id = ${postId}`;

    return { status: true };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function commentOnPost(
  userId: number,
  postId: number,
  comment: string
): Promise<doubleReturn<undefined>> {
  try {
    await sql`INSERT INTO cawcaw_post_comments (user_id, post_id, comment)
     VALUES (${userId}, ${postId}, ${comment});`;

    return { status: true };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

const rowPerPage = 10;

async function getLatestPosts(
  date: Date,
  page: number
): Promise<
  doubleReturn<{
    posts: post[];
    pageCount: number;
  }>
> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_posts 
      WHERE inserted_at < ${convertDateToDatabase(date)}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT * FROM cawcaw_posts 
      WHERE inserted_at < ${convertDateToDatabase(date)} 
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        posts: convertDatabasePostsToNormal(dbResponse.rows as post_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function getFollowingPosts(
  userId: number,
  date: Date,
  page: number
): Promise<
  doubleReturn<{
    posts: post[];
    pageCount: number;
  }>
> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_posts JOIN
    (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) 
    as following_table on cawcaw_posts.user_id = following_table.follows_id 
    WHERE inserted_at < ${convertDateToDatabase(date)}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse =
      await sql`SELECT cawcaw_posts.id,cawcaw_posts.user_id,cawcaw_posts.text,
    cawcaw_posts.image_url,cawcaw_posts.likes_count,cawcaw_posts.comments_count 
    as count FROM cawcaw_posts JOIN
    (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) 
    as following_table on cawcaw_posts.user_id = following_table.follows_id 
    WHERE inserted_at < ${convertDateToDatabase(date)}
    LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        posts: convertDatabasePostsToNormal(dbResponse.rows as post_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

export {
  createUser,
  fetchUser,
  updateUser,
  updatePassword,
  followUser,
  unfollowUser,
  createPost,
  removePost,
  likePost,
  unlikePost,
  commentOnPost,
  getLatestPosts,
  getFollowingPosts,
};
