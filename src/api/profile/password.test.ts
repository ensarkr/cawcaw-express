import "dotenv/config";
import {
  editPasswordRequestBody,
  editPasswordResponseBody,
  jwtBadResponse,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUser,
  getTestUser,
  insertTestUser,
  testUserData,
} from "../../functions/tests";
import bcrypt from "bcrypt";

const mainUrl = "http://localhost:5000/api" + "/profile/editPassword";

describe("edit password", () => {
  const requestBody: editPasswordRequestBody = {
    oldPassword: testUserData.password,
    newPassword: "newPassword123",
    reNewPassword: "newPassword123",
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

    const body: editPasswordResponseBody = await response.json();
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

    const body: editPasswordResponseBody = await response.json();
    const correctBody: editPasswordResponseBody = {
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

    const body: editPasswordResponseBody = await response.json();
    const correctBody: editPasswordResponseBody = {
      status: false,
      message: "Empty inputs.",
    };

    expect(body).toEqual(correctBody);
  });

  test("wrong old password", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        oldPassword: "wrongPassword",
      } as editPasswordRequestBody),
    });

    expect(response.status).toEqual(400);

    const body: editPasswordResponseBody = await response.json();
    const correctBody: editPasswordResponseBody = {
      status: false,
      message: "Wrong password.",
    };

    expect(body).toEqual(correctBody);
  });

  test("different new passwords", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        reNewPassword: "wrongPassword",
      } as editPasswordRequestBody),
    });

    expect(response.status).toEqual(400);

    const body: editPasswordResponseBody = await response.json();
    const correctBody: editPasswordResponseBody = {
      status: false,
      message: "New passwords do not match.",
    };

    expect(body).toEqual(correctBody);
  });

  test("edit password updated database", async () => {
    const response = await fetch(mainUrl, requestOptions);
    const body: editPasswordResponseBody = await response.json();

    expect(response.status).toEqual(200);

    if (!body.status) return false;

    expect(
      await bcrypt.compare(
        requestBody.newPassword,
        (
          await getTestUser()
        ).hashed_password
      )
    ).toEqual(true);
  });
});
