import "dotenv/config";
import { db, sql } from "@vercel/postgres";
import { doubleReturn } from "../typings/global.js";
import bcrypt from "bcrypt";
import {
  post,
  postComment_DB,
  post_DB,
  user,
  userPartial,
  user_DB,
} from "../typings/database.js";
import {
  convertDatabaseCommentsToNormal,
  convertDatabasePostToNormal,
  convertDatabasePostsToNormal,
  convertDatabaseUserToNormal,
  convertDatabaseUsersToPartial,
  convertDateToDatabase,
} from "./conversion.js";
import { getCommentsResponse, getPostsResponse } from "../typings/http.js";

const logDatabaseError = true;

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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
    if (logDatabaseError) console.log(e);
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
): Promise<getPostsResponse> {
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
    if (logDatabaseError) console.log(e);
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
): Promise<getPostsResponse> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_posts JOIN
    (SELECT * FROM cawcaw_follow_relation WHERE cawcaw_follow_relation.user_id = ${userId}) 
    as following_table on cawcaw_posts.user_id = following_table.follows_id 
    WHERE cawcaw_posts.inserted_at < ${convertDateToDatabase(date)}`;

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
    WHERE cawcaw_posts.inserted_at < ${convertDateToDatabase(date)}
    LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        posts: convertDatabasePostsToNormal(dbResponse.rows as post_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function searchPosts(
  searchQuery: string,
  date: Date,
  page: number
): Promise<getPostsResponse> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_posts 
      WHERE search @@ websearch_to_tsquery(${searchQuery})
      AND inserted_at < ${convertDateToDatabase(date)}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT * FROM cawcaw_posts 
      WHERE search @@ websearch_to_tsquery(${searchQuery})
      AND inserted_at < ${convertDateToDatabase(date)}
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        posts: convertDatabasePostsToNormal(dbResponse.rows as post_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function searchUsers(
  searchQuery: string,
  date: Date,
  page: number
): Promise<
  doubleReturn<{
    users: userPartial[];
    pageCount: number;
  }>
> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_users 
      WHERE search @@ websearch_to_tsquery(${searchQuery})
      AND inserted_at < ${convertDateToDatabase(date)}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT * FROM cawcaw_users  
      WHERE search @@ websearch_to_tsquery(${searchQuery})
      AND inserted_at < ${convertDateToDatabase(date)}
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        users: convertDatabaseUsersToPartial(dbResponse.rows as user_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchPublicUser(userId: number): Promise<doubleReturn<user>> {
  try {
    const dbResponse =
      await sql`SELECT * FROM cawcaw_users WHERE id = ${userId}`;

    if (dbResponse.rowCount === 0)
      return { status: false, message: "User not found." };

    const user = dbResponse.rows[0] as user_DB;

    return { status: true, value: convertDatabaseUserToNormal(user) };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchUserFollowers(
  userId: number,
  date: Date,
  page: number
): Promise<
  doubleReturn<{
    users: userPartial[];
    pageCount: number;
  }>
> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_users 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE follows_id = ${userId}) as followers_table
    ON cawcaw_users.id = followers_table.follows_id`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse =
      await sql`SELECT cawcaw_users.id, cawcaw_users.display_name, cawcaw_users.username FROM cawcaw_users 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE follows_id = ${userId}) as followers_table
    ON cawcaw_users.id = followers_table.follows_id
      WHERE followers_table.inserted_at < ${convertDateToDatabase(date)}
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        users: convertDatabaseUsersToPartial(dbResponse.rows as user_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchUserFollowings(
  userId: number,
  date: Date,
  page: number
): Promise<
  doubleReturn<{
    users: userPartial[];
    pageCount: number;
  }>
> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_users 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE user_id = ${userId}) as followers_table
    ON cawcaw_users.id = followers_table.follows_id`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse =
      await sql`SELECT cawcaw_users.id, cawcaw_users.display_name, cawcaw_users.username FROM cawcaw_users 
    JOIN (SELECT * FROM cawcaw_follow_relation WHERE user_id = ${userId}) as followers_table
    ON cawcaw_users.id = followers_table.follows_id
      WHERE followers_table.inserted_at < ${convertDateToDatabase(date)}
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        users: convertDatabaseUsersToPartial(dbResponse.rows as user_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchUserPosts(
  userId: number,
  date: Date,
  page: number
): Promise<getPostsResponse> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count FROM cawcaw_posts 
      WHERE user_id = ${userId}  AND inserted_at < ${convertDateToDatabase(
      date
    )}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT * FROM cawcaw_posts 
      WHERE user_id = ${userId}  
      AND  inserted_at < ${convertDateToDatabase(date)} 
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        posts: convertDatabasePostsToNormal(dbResponse.rows as post_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchUserComments(
  userId: number,
  date: Date,
  page: number
): Promise<getCommentsResponse> {
  try {
    let dbResponse =
      await sql`SELECT COUNT(*) as count FROM cawcaw_post_comments
      WHERE user_id = ${userId}  AND inserted_at < ${convertDateToDatabase(
        date
      )}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT * FROM cawcaw_post_comments 
      WHERE user_id = ${userId}  
      AND inserted_at < ${convertDateToDatabase(date)} 
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        comments: convertDatabaseCommentsToNormal(
          dbResponse.rows as postComment_DB[]
        ),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchUserLikes(
  userId: number,
  date: Date,
  page: number
): Promise<getPostsResponse> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count 
      FROM cawcaw_post_likes JOIN cawcaw_posts
      ON cawcaw_post_likes.post_id = cawcaw_posts.id
      WHERE cawcaw_post_likes.user_id = ${userId}  
      AND inserted_at < ${convertDateToDatabase(date)}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT 
      cawcaw_posts.id,
      cawcaw_posts.user_id,
      cawcaw_posts.text,
      cawcaw_posts.image_url,
      cawcaw_posts.likes_count,
      cawcaw_posts.comments_count,
      cawcaw_posts.inserted_at
      FROM cawcaw_post_likes JOIN cawcaw_posts 
      ON cawcaw_post_likes.post_id = cawcaw_posts.id
      WHERE cawcaw_post_likes.user_id = ${userId}  
      AND inserted_at < ${convertDateToDatabase(date)} 
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        posts: convertDatabasePostsToNormal(dbResponse.rows as post_DB[]),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchPostComments(
  postId: number,
  date: Date,
  page: number
): Promise<getCommentsResponse> {
  try {
    let dbResponse = await sql`SELECT COUNT(*) as count 
      FROM cawcaw_post_comments 
      WHERE post_id = ${postId}  
      AND inserted_at < ${convertDateToDatabase(date)}`;

    const pageCount = Math.ceil(dbResponse.rows[0].count / rowPerPage);

    if (page > pageCount - 1) {
      return { status: false, message: "Page does not exist." };
    }

    dbResponse = await sql`SELECT *  FROM cawcaw_post_comments 
      WHERE post_id = ${postId}   
      AND inserted_at < ${convertDateToDatabase(date)} 
      LIMIT ${10} OFFSET ${rowPerPage * page}`;

    return {
      status: true,
      value: {
        comments: convertDatabaseCommentsToNormal(
          dbResponse.rows as postComment_DB[]
        ),
        pageCount,
      },
    };
  } catch (e) {
    if (logDatabaseError) console.log(e);
    return {
      status: false,
      message: "Database error occurred.",
    };
  }
}

async function fetchPost(postId: number): Promise<doubleReturn<post>> {
  try {
    const dbResponse =
      await sql`SELECT * FROM cawcaw_users WHERE id = ${postId}`;

    if (dbResponse.rowCount === 0)
      return { status: false, message: "Post not found." };

    const post = dbResponse.rows[0] as post_DB;

    return { status: true, value: convertDatabasePostToNormal(post) };
  } catch (e) {
    if (logDatabaseError) console.log(e);
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
  searchPosts,
  searchUsers,
  fetchPublicUser,
  fetchUserFollowers,
  fetchUserFollowings,
  fetchUserPosts,
  fetchUserComments,
  fetchUserLikes,
  fetchPostComments,
  fetchPost,
};
