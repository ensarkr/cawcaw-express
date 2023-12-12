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
  testHost,
  testUserData,
} from "../../functions/tests";
import bcrypt from "bcrypt";
import {
  checkJWT_TEST,
  checkEmptyBody_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/profile/editPassword";

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

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);
  
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
