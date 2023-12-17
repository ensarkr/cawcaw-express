import "dotenv/config";
import { signUpRequestBody, signUpResponseBody } from "../../typings/http";
import {
  deleteTestUserByUsername,
  deleteTestUsers,
  testHost,
  testUserData,
} from "../../functions/tests";
import { checkEmptyBody_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/auth/signUp";

describe("sign up", () => {
  const requestBody: signUpRequestBody = {
    displayName: testUserData.displayName,
    username: testUserData.username,
    password: testUserData.password,
    rePassword: testUserData.password,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      ...requestBody,
    }),
  };

  afterAll(async () => {
    await deleteTestUserByUsername();
  });

  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("different passwords", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        rePassword: "different password",
      } as signUpRequestBody),
    });

    expect(response.status).toEqual(400);

    const data: signUpResponseBody = await response.json();
    const correctBody: signUpResponseBody = {
      status: false,
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
      status: false,
      message: "This username cannot be used.",
    };

    expect(body).toEqual(correctBody);
  });
});
