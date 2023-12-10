import "dotenv/config";
import { db, sql } from "@vercel/postgres";
import { doubleReturn } from "../typings/global.js";
import bcrypt from "bcrypt";
import { user, user_DB } from "../typings/database.js";

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

function convertDatabaseUserToNormal(user: user_DB): user {
  return {
    id: user.id,
    displayName: user.display_name,
    username: user.username,
    description: user.description,
  };
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

export { createUser, fetchUser, updateUser, updatePassword };
