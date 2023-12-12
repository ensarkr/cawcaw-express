import "dotenv/config";
import {
  unfollowUserRequestBody,
  unfollowUserResponseBody,
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
  addFollowRelation,
  deleteAddedFollowRelation,
  testHost,
} from "../../functions/tests";
import {
  checkEmptyBody_TEST,
  checkJWT_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/action/unfollow";

const requestBody: unfollowUserRequestBody = {
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

describe("unfollow user", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertTestUser2();
    await addFollowRelation();
  });

  afterAll(async () => {
    await deleteTestUser();
    await deleteTestUser2();
    await deleteAddedFollowRelation();
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

    expect(await getAllFollowRelationsByTestUser()).toHaveLength(0);
    expect((await getTestUser()).following_count).toEqual(0);
    expect((await getTestUser2()).followers_count).toEqual(0);
  });
});
