import "dotenv/config";
import { sql } from "@vercel/postgres";
import { doubleReturn } from "../typings/global.js";
import bcrypt from "bcrypt";

async function createUser(
  displayName: string,
  userName: string,
  password: string
): Promise<doubleReturn<true>> {
  try {
    await sql`INSERT INTO cawcaw_users (display_name, username, hashed_password) 
    VALUES (${displayName},${userName}, ${await bcrypt.hash(password, 10)})`;

    return { status: true, value: true };
  } catch (e) {
    return {
      status: false,
      message: (e as Error).message.includes("duplicate key")
        ? "This username cannot be used."
        : "Error occurred.",
    };
  }
}

export { createUser };
