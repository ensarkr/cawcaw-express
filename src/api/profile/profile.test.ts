import "dotenv/config";
import {
  editProfileRequestBody,
  editProfileResponseBody,
  jwtBadResponse,
} from "../../typings/http";
import { createJWT, decodeJWTPayload } from "../../functions/jwt";
import {
  deleteTestUser,
  getTestUser,
  insertTestUser,
  testUserData,
} from "../../functions/tests";

const mainUrl = "http://localhost:5000/api" + "/profile/edit";

describe("edit profile", () => {
  const requestBody: editProfileRequestBody = {
    username: testUserData.username,
    displayName: testUserData.displayName,
    description: testUserData.description,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      authorization: createJWT({
        id: testUserData.id,
        username: testUserData.username,
        displayName: testUserData.displayName,
      }),
    },
    body: JSON.stringify({
      ...requestBody,
    }),
  };

  beforeAll(async () => {
    await insertTestUser();
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  test("no jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    expect(response.status).toEqual(401);

    const body: editProfileResponseBody = await response.json();
    const correctBody: jwtBadResponse = {
      status: false,
      message: "Token cannot be found.",
    };

    expect(body).toEqual(correctBody);
  });

  test("tampered jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {
        ...requestOptions.headers,
        authorization: "tampered-jwt",
      },
    });
    expect(response.status).toEqual(401);

    const body: editProfileResponseBody = await response.json();
    const correctBody: editProfileResponseBody = {
      status: false,
      message: "Tampered or expired token.",
      actions: ["deleteJWT"],
    };

    expect(body).toEqual(correctBody);
  });

  test("empty body", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: "",
    });

    expect(response.status).toEqual(400);

    const body: editProfileResponseBody = await response.json();
    const correctBody: editProfileResponseBody = {
      status: false,
      message: "Empty inputs.",
    };

    expect(body).toEqual(correctBody);
  });

  test("edit profile has correct JWT and updated database", async () => {
    const response = await fetch(mainUrl, requestOptions);
    const body: editProfileResponseBody = await response.json();

    expect(response.status).toEqual(200);

    if (!body.status) return false;
    expect(typeof body.value).toBe("string");

    const payload = decodeJWTPayload(body.value);

    expect(payload.username).toEqual(requestBody.username);
    expect(payload.displayName).toEqual(requestBody.displayName);
    expect((await getTestUser()).description).toEqual(requestBody.description);
  });
});
