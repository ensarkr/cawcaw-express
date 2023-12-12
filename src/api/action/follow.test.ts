import "dotenv/config";
import {
  followUserRequestBody,
  followUserResponseBody,
  jwtBadResponse,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUser,
  deleteTestUser2,
  insertTestUser,
  insertTestUser2,
  testUserData,
  testUserData2,
  getTestUser2,
  getTestUser,
  getAllFollowRelationsByTestUser,
  deleteAddedFollowRelation,
  testHost,
} from "../../functions/tests";
import {
  checkEmptyBody_TEST,
  checkJWT_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/action/follow";

const requestBody: followUserRequestBody = {
  targetId: testUserData2.id,
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

describe("follow user", () => {
  // * first test user follows second one

  beforeAll(async () => {
    await insertTestUser();
    await insertTestUser2();
  });

  afterAll(async () => {
    await deleteTestUser();
    await deleteTestUser2();
    await deleteAddedFollowRelation();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("follow second user", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: followUserResponseBody = await response.json();
    const correctBody: followUserResponseBody = {
      status: true,
    };

    expect(body).toEqual(correctBody);

    expect(await getAllFollowRelationsByTestUser()).toHaveLength(1);
    expect((await getTestUser()).following_count).toEqual(1);
    expect((await getTestUser2()).followers_count).toEqual(1);
  });

  test("follow second user again", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(400);

    const body: followUserResponseBody = await response.json();
    const correctBody: followUserResponseBody = {
      status: false,
      message: "Already following.",
    };

    expect(body).toEqual(correctBody);
  });
});
