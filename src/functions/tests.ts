import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { user_DB } from "../typings/database.js";

const testUserData = {
  id: 0,
  displayName: "test user",
  username: "testUser",
  password: "strongPassword",
  description: "description",
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
    return (await sql`SELECT * FROM cawcaw_users WHERE id = 0`)
      .rows[0] as user_DB;
  } else {
    return (
      await sql`SELECT * FROM cawcaw_users WHERE username ${testUserData.username}`
    ).rows[0] as user_DB;
  }
}

export { insertTestUser, deleteTestUser, testUserData, getTestUser };
