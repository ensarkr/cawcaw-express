import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import {
  followRelation_DB,
  postLikes_DB,
  post_DB,
  user_DB,
} from "../typings/database.js";

const localHost = "http://localhost:5000/api";
const vercelHost = "https://cawcaw-express-ensarkr.vercel.app/api";

const testHost = localHost;

const testUserData = {
  id: 0,
  displayName: "test user",
  username: "testUser",
  password: "strongPassword",
  description: "description",
};

const testPostData = {
  id: 0,
  text: "post text",
  image_url: "description",
};

const testUserData2 = {
  id: 1,
  displayName: "test user2",
  username: "testUser2",
  password: "strongPassword2",
  description: "description2",
};

async function insertTestUser() {
  await sql`INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData.id},
    ${testUserData.username}, 
    ${testUserData.displayName},
    ${await bcrypt.hash(testUserData.password, 10)}) `;
}

async function deleteTestUser(condition?: string) {
  if (condition === undefined) {
    await sql`DELETE FROM cawcaw_users WHERE id = 0`;
  } else {
    await (sql`DELETE FROM cawcaw_users ` + condition);
  }
}

async function getTestUser(useUsername?: boolean): Promise<user_DB> {
  if (useUsername === undefined || useUsername === false) {
    return (await sql`SELECT * FROM cawcaw_users WHERE id = ${testUserData.id}`)
      .rows[0] as user_DB;
  } else {
    return (
      await sql`SELECT * FROM cawcaw_users WHERE username ${testUserData.username}`
    ).rows[0] as user_DB;
  }
}

async function insertTestUser2() {
  await sql`INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData2.id},
    ${testUserData2.username}, 
    ${testUserData2.displayName},
    ${await bcrypt.hash(testUserData2.password, 10)}) `;
}

async function deleteTestUser2(condition?: string) {
  if (condition === undefined) {
    await sql`DELETE FROM cawcaw_users WHERE id = ${testUserData2.id}`;
  } else {
    await (sql`DELETE FROM cawcaw_users ` + condition);
  }
}

async function getTestUser2(useUsername?: boolean): Promise<user_DB> {
  if (useUsername === undefined || useUsername === false) {
    return (
      await sql`SELECT * FROM cawcaw_users WHERE id = ${testUserData2.id}`
    ).rows[0] as user_DB;
  } else {
    return (
      await sql`SELECT * FROM cawcaw_users WHERE username = ${testUserData2.username}`
    ).rows[0] as user_DB;
  }
}

async function getAllFollowRelationsByTestUser(): Promise<followRelation_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_follow_relation  WHERE user_id = ${testUserData.id}`
  ).rows as followRelation_DB[];
}

async function deleteAddedFollowRelation() {
  await sql`DELETE FROM cawcaw_follow_relation
   WHERE user_id = ${testUserData.id} AND follows_id = ${testUserData2.id}`;
}

async function addFollowRelation() {
  await sql`INSERT INTO cawcaw_follow_relation (user_id,follows_id) VALUES 
  (${testUserData.id} , ${testUserData2.id})`;
}

async function getPostsByTestUser(): Promise<post_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_posts WHERE user_id = ${testUserData.id}`
  ).rows as post_DB[];
}

async function deleteAllPostsByTestUser(): Promise<post_DB[]> {
  return (
    await sql`DELETE FROM cawcaw_posts WHERE user_id = ${testUserData.id}`
  ).rows as post_DB[];
}

async function insertPostByTestUser() {
  await sql`INSERT INTO cawcaw_posts (id, user_id, text)
    VALUES (${testPostData.id}, ${testUserData.id}, ${testPostData.text})`;
}

async function getAllPostLikesByTestUser(): Promise<postLikes_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_post_likes  WHERE user_id = ${testUserData.id}`
  ).rows as postLikes_DB[];
}

export {
  insertTestUser,
  deleteTestUser,
  getTestUser,
  insertTestUser2,
  deleteTestUser2,
  getTestUser2,
  testUserData,
  testUserData2,
  getAllFollowRelationsByTestUser,
  deleteAddedFollowRelation,
  addFollowRelation,
  testHost,
  getPostsByTestUser,
  deleteAllPostsByTestUser,
  insertPostByTestUser,
  testPostData,
  getAllPostLikesByTestUser,
};
