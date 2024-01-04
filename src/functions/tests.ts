import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import {
  followRelation_DB,
  postComment_DB,
  postLikes_DB,
  post_DB,
  user_DB,
} from "../typings/database.js";
import { jwtBadResponse } from "../typings/http.js";

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

const testPostDatas: { text: string; image_url: string }[] = [
  {
    text: "Dax El Salvador Gabriel Germany",
    image_url: "imageURL",
  },
  {
    text: "welfare Milly Belarus test unknown Ladonna ashamed scheme potential",
    image_url: "imageURL",
  },
  {
    text: "lane charge Cydney Iyanna council",
    image_url: "imageURL",
  },
  {
    text: "Bambi monthly pain Kylan Norway",
    image_url: "imageURL",
  },
  {
    text: "upset Monaco Ottie Hong Kong technique test resistance education Panama",
    image_url: "imageURL",
  },
  {
    text: "limping soil Hong Kong Evangelina Torrie Denton tragic pitiful Kate DR Congo evidence Zhane",
    image_url: "imageURL",
  },
  {
    text: "source tense plump chairman Moldova Bulgaria harmonious pricey Miguelangel appeal Cheyanne Iraq Lettie Slovenia",
    image_url: "imageURL",
  },
  {
    text: "report aircraft Jeannine occasional test wonderful miserly",
    image_url: "imageURL",
  },
  {
    text: "Susanna Luxembourg Duwayne Octavius Esther French Guiana India Lyla Togo stupendous oil",
    image_url: "imageURL",
  },
  {
    text: "court Lesotho test project firm movement ministry Cabo Verde Maryam",
    image_url: "imageURL",
  },
];

const secondTestUser = {
  id: 1,
  displayName: "test user 2",
  username: "testUser2",
  password: "strongPassword",
  description: "description",
};

const testUserDatas: {
  id: number;
  displayName: string;
  username: string;
  password: string;
  description: string;
}[] = [
  {
    displayName: "Othel test",
    username: "teampotabledelivery",
    password: "))&Xr}]5'M)L",
    description: "desc",
    id: 2,
  },
  {
    displayName: "Babymale Augustine Glynis",
    username: "dreamitemShaquantour",
    password: "9?#r@0\\5B2",
    description: "desc",
    id: 3,
  },
  {
    displayName: "Cameron",
    username: "speaker",
    password: "-=,c5165#`+",
    description: "desc",
    id: 4,
  },
  {
    displayName: "Inger Fleming",
    username: "AllanWarnetestrBirtieYancy",
    password: "7E$=cm-Q0rc",
    description: "desc",
    id: 5,
  },
  {
    displayName: "Arnold Lissie",
    username: "contentsettlementJagger",
    password: "69G5kA<50,02",
    description: "desc",
    id: 6,
  },
  {
    displayName: "Betsey Jamila",
    username: "Spencetestrrecordlanguagescene",
    password: "S[g80:F.7:",
    description: "desc",
    id: 7,
  },
  {
    displayName: "Nakisha test Alanzo",
    username: "childArielTysonprotection",
    password: "055-U39516i!",
    description: "desc",
    id: 8,
  },
  {
    displayName: "Carole Telly Makena",
    username: "teaAramintaKay",
    password: "t*i2~^8~6",
    description: "desc",
    id: 9,
  },
  {
    displayName: "Brennan Tyrell Jacque",
    username: "conflict",
    password: "2.xq693I*",
    description: "desc",
    id: 10,
  },
  {
    displayName: "Bridger test Storm Cinda",
    username: "Sena",
    password: "<N:1D0xy",
    description: "desc",
    id: 11,
  },
  {
    displayName: "Alphonsus",
    username: "JermainLilyana",
    password: "06770l$Z",
    description: "desc",
    id: 12,
  },
  {
    displayName: "Marcela",
    username: "restauranttestWillianunwritten",
    password: "8Uw~&_3v4d&",
    description: "desc",
    id: 13,
  },
];

const testPostData = {
  id: 0,
  text: "post text",
  image_url: "description",
};

async function insertTestUser() {
  await sql`INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData.id},
    ${testUserData.username}, 
    ${testUserData.displayName},
    ${await bcrypt.hash(testUserData.password, 10)}) `;
}

async function deleteTestUserByUsername() {
  await sql`DELETE FROM cawcaw_users WHERE username = ${testUserData.username}`;
}

async function deleteTestUsers() {
  // * first 13 users are reserved for tests
  await sql`DELETE FROM cawcaw_users WHERE id < 14`;
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

async function insertSecondTestUser() {
  await sql`INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${secondTestUser.id},
    ${secondTestUser.username}, 
    ${secondTestUser.displayName},
    ${await bcrypt.hash(secondTestUser.password, 10)}) `;
}

async function getSecondTestUser(useUsername?: boolean): Promise<user_DB> {
  if (useUsername === undefined || useUsername === false) {
    return (
      await sql`SELECT * FROM cawcaw_users WHERE id = ${secondTestUser.id}`
    ).rows[0] as user_DB;
  } else {
    return (
      await sql`SELECT * FROM cawcaw_users WHERE username = ${secondTestUser.username}`
    ).rows[0] as user_DB;
  }
}

async function getFollowRelationsOfTestUser(): Promise<followRelation_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_follow_relation  WHERE user_id = ${testUserData.id}`
  ).rows as followRelation_DB[];
}

async function addTestFollowRelation() {
  await sql`INSERT INTO cawcaw_follow_relation (user_id,follows_id) VALUES 
  (${testUserData.id} , ${secondTestUser.id})`;
}

async function addTestFollowItself() {
  await sql`INSERT INTO cawcaw_follow_relation (user_id,follows_id) VALUES 
  (${testUserData.id} , ${testUserData.id})`;
}

async function getPostsOfTestUser(): Promise<post_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_posts WHERE user_id = ${testUserData.id}`
  ).rows as post_DB[];
}

async function insertPostByTestUser() {
  await sql`INSERT INTO cawcaw_posts (id, user_id, text)
    VALUES (${testPostData.id}, ${testUserData.id}, ${testPostData.text})`;
}

async function insertPostsByTestUser(postCount: number) {
  for (let i = 0; i < postCount; i++) {
    await sql`INSERT INTO cawcaw_posts ( user_id, text)
    VALUES ( ${testUserData.id}, ${testPostData.text})`;
  }
}

async function insertPostsBySecondTestUser(postCount: number) {
  for (let i = 0; i < postCount; i++) {
    await sql`INSERT INTO cawcaw_posts ( user_id, text)
    VALUES ( ${secondTestUser.id}, ${testPostData.text})`;
  }
}

async function insertPrefilledPostsByTestUser() {
  for (let i = 0; i < testPostDatas.length; i++) {
    await sql`INSERT INTO cawcaw_posts ( user_id, text,image_url)
    VALUES (${testUserData.id}, ${testPostDatas[i].text},${testPostDatas[i].image_url})`;
  }
}

async function insertPrefilledTestUsers() {
  for (let i = 0; i < testUserDatas.length; i++) {
    await sql`INSERT INTO cawcaw_users ( id,display_name,username,hashed_password,description )
    VALUES ( ${testUserDatas[i].id} ,${testUserDatas[i].displayName}, ${testUserDatas[i].username},${testUserDatas[i].password},${testUserDatas[i].description})`;
  }
}

async function getPostLikesOfTestUser(): Promise<postLikes_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_post_likes  WHERE user_id = ${testUserData.id}`
  ).rows as postLikes_DB[];
}

async function addLikeByTestUser(): Promise<postLikes_DB[]> {
  return (
    await sql`INSERT INTO cawcaw_post_likes (user_id,post_id)
    VALUES (${testUserData.id},${testPostData.id})`
  ).rows as postLikes_DB[];
}

async function getAllCommentsOfTestUser(): Promise<postComment_DB[]> {
  return (
    await sql`SELECT * FROM cawcaw_post_comments WHERE user_id = ${testUserData.id}`
  ).rows as postComment_DB[];
}

async function insertCommentsByTestUser(commentCount: number) {
  for (let i = 0; i < commentCount; i++) {
    await sql`INSERT INTO cawcaw_post_comments ( user_id, post_id, comment )
    VALUES (${testUserData.id} ,${testPostData.id}, ${testPostData.text})`;
  }
}

export {
  insertTestUser,
  deleteTestUsers,
  getTestUser,
  insertSecondTestUser,
  getSecondTestUser,
  testUserData,
  secondTestUser,
  getFollowRelationsOfTestUser,
  addTestFollowRelation,
  testHost,
  getPostsOfTestUser,
  insertPostByTestUser,
  testPostData,
  getPostLikesOfTestUser,
  getAllCommentsOfTestUser,
  insertPostsByTestUser,
  insertPostsBySecondTestUser,
  insertPrefilledPostsByTestUser,
  insertPrefilledTestUsers,
  insertCommentsByTestUser,
  addLikeByTestUser,
  deleteTestUserByUsername,
  addTestFollowItself,
};
