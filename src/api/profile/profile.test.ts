import "dotenv/config";
import {
  editProfileRequestBody,
  editProfileResponseBody,
} from "../../typings/http";
import { createJWT, decodeJWTPayload } from "../../functions/jwt";
import {
  deleteTestUsers,
  getTestUser,
  insertTestUser,
  testUserData,
  testHost,
} from "../../functions/tests";
import {
  checkJWT_TEST,
  checkEmptyBody_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/profile/edit";

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
    await deleteTestUsers();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("edit profile has correct JWT and updated database", async () => {
    const response = await fetch(mainUrl, requestOptions);
    const body: editProfileResponseBody = await response.json();

    expect(response.status).toEqual(200);

       if (!body.status) {
      throw "Status is wrong";
    }
    expect(typeof body.value).toBe("string");

    const payload = decodeJWTPayload(body.value);

    expect(payload.username).toEqual(requestBody.username);
    expect(payload.displayName).toEqual(requestBody.displayName);
    expect((await getTestUser()).description).toEqual(requestBody.description);
  });
});
