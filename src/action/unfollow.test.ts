import "dotenv/config";
import {
  unfollowUserRequestBody,
  unfollowUserResponseBody,
  jwtBadResponse,
} from "../typings/http";
import { createJWT } from "../functions/jwt";
import {
  deleteTestUser,
  deleteTestUser2,
  insertTestUser,
  insertTestUser2,
  testUserData,
  testUserData2,
  getTestUser2,
  getTestUser,
  getAllFollowRelations,
  addFollowRelation,
  deleteAddedFollowRelation,
} from "../functions/tests";

const mainUrl = "http://localhost:5000/api" + "/action/unfollow";

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

  test("no jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    expect(response.status).toEqual(401);

    const body: unfollowUserRequestBody = await response.json();
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

    const body: unfollowUserRequestBody = await response.json();
    const correctBody: unfollowUserResponseBody = {
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

    const body: unfollowUserResponseBody = await response.json();
    const correctBody: unfollowUserResponseBody = {
      status: false,
      message: "Empty inputs.",
    };

    expect(body).toEqual(correctBody);
  });

  test("unfollow second user", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: unfollowUserResponseBody = await response.json();
    const correctBody: unfollowUserResponseBody = {
      status: true,
    };

    expect(body).toEqual(correctBody);

    expect(
      (await getAllFollowRelations()).filter(
        (e) => e.follows_id === 1 && e.user_id === 0
      )
    ).toHaveLength(0);
    expect((await getTestUser()).following_count).toEqual(0);
    expect((await getTestUser2()).followers_count).toEqual(0);
  });
});
