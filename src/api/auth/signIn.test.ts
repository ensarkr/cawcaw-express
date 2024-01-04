import "dotenv/config";
import { signInRequestBody, signInResponseBody } from "../../typings/http";
import { decodeJWTPayload } from "../../functions/jwt";
import {
  deleteTestUserByUsername,
  insertTestUser,
  testHost,
  testUserData,
} from "../../functions/tests";
import { checkEmptyBody_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/auth/signIn";

const requestBody: signInRequestBody = {
  username: testUserData.username,
  password: testUserData.password,
};

const requestOptions: RequestInit = {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    ...requestBody,
  }),
};

describe("sign in", () => {
  beforeAll(async () => {
    await insertTestUser();
  });

  afterAll(async () => {
    await deleteTestUserByUsername();
  });

  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("random username", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        username: Math.random().toString(),
      } as signInRequestBody),
    });

    expect(response.status).toEqual(400);

    const body: signInResponseBody = await response.json();
    const correctBody: signInResponseBody = {
      status: false,
      message: "Wrong username or password.",
    };

    expect(body).toEqual(correctBody);
  });

  test("wrong password", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        password: "wrongPassword",
      } as signInRequestBody),
    });

    expect(response.status).toEqual(400);

    const body: signInResponseBody = await response.json();
    const correctBody: signInResponseBody = {
      status: false,
      message: "Wrong username or password.",
    };

    expect(body).toEqual(correctBody);
  });

  test("sign in has correct JWT", async () => {
    const response = await fetch(mainUrl, requestOptions);
    const body: signInResponseBody = await response.json();

    expect(response.status).toEqual(200);

       if (!body.status) {
      throw "Status is wrong";
    }
    expect(typeof body.value).toBe("string");

    const payload = decodeJWTPayload(body.value);

    expect(payload.username).toEqual(requestBody.username);
    expect(payload.displayName).toEqual(testUserData.displayName);
    expect(payload.userId).toEqual(testUserData.id);
  });
});
