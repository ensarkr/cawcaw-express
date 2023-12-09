import { sql } from "@vercel/postgres";
import "dotenv/config";
import { signUpRequestBody, signUpResponseBody } from "../typings/http";

const mainUrl = "http://localhost:5000/api" + "/auth/signUp";

describe("sign up", () => {
  const requestBody: signUpRequestBody = {
    displayName: "test user",
    username: "testUser",
    password: "strongPassword",
    rePassword: "strongPassword",
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      ...requestBody,
    }),
  };

  beforeAll(async () => {
    await sql`DELETE FROM cawcaw_users WHERE username = 'testUser' `;
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

  test("different passwords", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        rePassword: "different password",
      } as signUpRequestBody),
    });

    const data: signUpResponseBody = await response.json();
    const correctBody: signUpResponseBody = {
      message: "Passwords do not match.",
    };

    expect(data).toEqual(correctBody);
  });

  test("create user", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);
  });

  test("create duplicate user", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(400);

    const body: signUpResponseBody = await response.json();
    const correctBody: signUpResponseBody = {
      message: "This username cannot be used.",
    };

    expect(body).toEqual(correctBody);
  });
});
