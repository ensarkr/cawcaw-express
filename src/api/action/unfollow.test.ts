import "dotenv/config";
import {
  unfollowUserRequestBody,
  unfollowUserResponseBody,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUsers,
  insertTestUser,
  insertSecondTestUser,
  testUserData,
  secondTestUser,
  getSecondTestUser,
  getTestUser,
  getFollowRelationsOfTestUser,
  addTestFollowRelation,
  testHost,
} from "../../functions/tests";
import {
  checkEmptyBody_TEST,
  checkJWT_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/action/unfollow";

const requestBody: unfollowUserRequestBody = {
  targetId: secondTestUser.id,
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

describe("unfollow user", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertSecondTestUser();
    await addTestFollowRelation();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("unfollow second user", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: unfollowUserResponseBody = await response.json();
    const correctBody: unfollowUserResponseBody = {
      status: true,
    };

    expect(body).toEqual(correctBody);

    expect(await getFollowRelationsOfTestUser()).toHaveLength(0);
    expect((await getTestUser()).following_count).toEqual(0);
    expect((await getSecondTestUser()).followers_count).toEqual(0);
  });
});
