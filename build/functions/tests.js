import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
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
    await sql `INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData.id},
    ${testUserData.username}, 
    ${testUserData.displayName},
    ${await bcrypt.hash(testUserData.password, 10)}) `;
}
async function deleteTestUser(condition) {
    if (condition === undefined) {
        await sql `DELETE FROM cawcaw_users WHERE id = 0`;
    }
    else {
        await (sql `DELETE FROM cawcaw_users ` + condition);
    }
}
async function getTestUser(useUsername) {
    if (useUsername === undefined || useUsername === false) {
        return (await sql `SELECT * FROM cawcaw_users WHERE id = ${testUserData.id}`)
            .rows[0];
    }
    else {
        return (await sql `SELECT * FROM cawcaw_users WHERE username ${testUserData.username}`).rows[0];
    }
}
async function insertTestUser2() {
    await sql `INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData2.id},
    ${testUserData2.username}, 
    ${testUserData2.displayName},
    ${await bcrypt.hash(testUserData2.password, 10)}) `;
}
async function deleteTestUser2(condition) {
    if (condition === undefined) {
        await sql `DELETE FROM cawcaw_users WHERE id = ${testUserData2.id}`;
    }
    else {
        await (sql `DELETE FROM cawcaw_users ` + condition);
    }
}
async function getTestUser2(useUsername) {
    if (useUsername === undefined || useUsername === false) {
        return (await sql `SELECT * FROM cawcaw_users WHERE id = ${testUserData2.id}`).rows[0];
    }
    else {
        return (await sql `SELECT * FROM cawcaw_users WHERE username = ${testUserData2.username}`).rows[0];
    }
}
async function getAllFollowRelationsByTestUser() {
    return (await sql `SELECT * FROM cawcaw_follow_relation  WHERE user_id = ${testUserData.id}`).rows;
}
async function deleteAddedFollowRelation() {
    await sql `DELETE FROM cawcaw_follow_relation
   WHERE user_id = ${testUserData.id} AND follows_id = ${testUserData2.id}`;
}
async function addFollowRelation() {
    await sql `INSERT INTO cawcaw_follow_relation (user_id,follows_id) VALUES 
  (${testUserData.id} , ${testUserData2.id})`;
}
async function getPostsByTestUser() {
    return (await sql `SELECT * FROM cawcaw_posts WHERE user_id = ${testUserData.id}`).rows;
}
async function deleteAllPostsByTestUser() {
    return (await sql `DELETE FROM cawcaw_posts WHERE user_id = ${testUserData.id}`).rows;
}
async function insertPostByTestUser() {
    await sql `INSERT INTO cawcaw_posts (id, user_id, text)
    VALUES (${testPostData.id}, ${testUserData.id}, ${testPostData.text})`;
}
async function insertPostsByTestUser(postCount) {
    for (let i = 0; i < postCount; i++) {
        await sql `INSERT INTO cawcaw_posts ( user_id, text)
    VALUES ( ${testUserData.id}, ${testPostData.text})`;
    }
}
async function insertPostsByTestUser2(postCount) {
    for (let i = 0; i < postCount; i++) {
        await sql `INSERT INTO cawcaw_posts ( user_id, text)
    VALUES ( ${testUserData2.id}, ${testPostData.text})`;
    }
}
async function getAllPostLikesByTestUser() {
    return (await sql `SELECT * FROM cawcaw_post_likes  WHERE user_id = ${testUserData.id}`).rows;
}
async function getAllCommentsByTestUser() {
    return (await sql `SELECT * FROM cawcaw_post_comments WHERE user_id = ${testUserData.id}`).rows;
}
export { insertTestUser, deleteTestUser, getTestUser, insertTestUser2, deleteTestUser2, getTestUser2, testUserData, testUserData2, getAllFollowRelationsByTestUser, deleteAddedFollowRelation, addFollowRelation, testHost, getPostsByTestUser, deleteAllPostsByTestUser, insertPostByTestUser, testPostData, getAllPostLikesByTestUser, getAllCommentsByTestUser, insertPostsByTestUser, insertPostsByTestUser2, };
