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

  test("no jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    expect(response.status).toEqual(401);

    const body: followUserRequestBody = await response.json();
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

    const body: followUserRequestBody = await response.json();
    const correctBody: followUserResponseBody = {
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

    const body: followUserResponseBody = await response.json();
    const correctBody: followUserResponseBody = {
      status: false,
      message: "Empty inputs.",
    };

    expect(body).toEqual(correctBody);
  });

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
