import { sql } from "@vercel/postgres";
import "dotenv/config";
import { signInRequestBody, signInResponseBody } from "../typings/http";
import bcrypt from "bcrypt";
import { decodeJWTPayload } from "../functions/jwt";

const mainUrl = "http://localhost:5000/api" + "/auth/signIn";

describe("sign in", () => {
  const requestBody: signInRequestBody = {
    username: "testUser",
    password: "strongPassword",
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      ...requestBody,
    }),
  };

  beforeAll(async () => {
    await sql`INSERT INTO cawcaw_users (username,display_name,hashed_password) VALUES ('testUser', 'test user',
     ${await bcrypt.hash(requestBody.password, 10)}) `;
  });

  afterAll(async () => {
    await sql`DELETE FROM cawcaw_users WHERE username = 'testUser' `;
  });

  test("empty body", async () => {
    const response = await fetch(mainUrl, {
      method: "POST",
    });
    expect(response.status).toEqual(400);
  });

  test("random username", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        username: Math.random().toString(),
      } as signInRequestBody),
    });

    const data: signInResponseBody = await response.json();
    const correctBody: signInResponseBody = {
      message: "Wrong username or password.",
    };

    expect(data).toEqual(correctBody);
  });

  test("wrong password", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        password: "wrongPassword",
      } as signInRequestBody),
    });

    const data: signInResponseBody = await response.json();
    const correctBody: signInResponseBody = {
      message: "Wrong username or password.",
    };

    expect(data).toEqual(correctBody);
  });

  test("sign in has correct JWT", async () => {
    const response = await fetch(mainUrl, requestOptions);
    const data: signInResponseBody = await response.json();

    expect(response.status).toEqual(200);
    expect(typeof data.jwtToken).toEqual("string");
    const payload = decodeJWTPayload(data.jwtToken as string);
    expect(payload.username).toEqual(requestBody.username);
    expect(payload).toHaveProperty("displayName");
    expect(payload).toHaveProperty("userId");
  });
});
