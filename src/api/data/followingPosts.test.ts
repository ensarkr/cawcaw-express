import "dotenv/config";
import {
  getPostsQuery,
  getPostsResponse,
  jwtBadResponse,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  addFollowRelation,
  deleteTestUser,
  deleteTestUser2,
  insertPostsByTestUser,
  insertPostsByTestUser2,
  insertTestUser,
  insertTestUser2,
  testHost,
  testUserData,
  testUserData2,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";

const mainUrl = testHost + "/data/posts/following";

const requestQuery: getPostsQuery = {
  endDate: new Date(Date.now() + 99999999999),
  page: 0,
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
  headers: {
    authorization: createJWT({
      id: testUserData.id,
      username: testUserData.username,
      displayName: testUserData.displayName,
    }),
  },
};

describe("get following users posts", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertTestUser2();
    await addFollowRelation();
    await insertPostsByTestUser(15);
    await insertPostsByTestUser2(15);
  });

  afterAll(async () => {
    await deleteTestUser();
    await deleteTestUser2();
  });

  test("no jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {},
    });

    expect(response.status).toEqual(401);

    const body: getPostsResponse = await response.json();
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

    const body: getPostsResponse = await response.json();
    const correctBody: getPostsResponse = {
      status: false,
      message: "Tampered or expired token.",
      actions: ["deleteJWT"],
    };

    expect(body).toEqual(correctBody);
  });

  test("no queries", async () => {
    const response = await fetch(mainUrl, requestOptions);
    expect(response.status).toEqual(400);

    const body: getPostsResponse = await response.json();
    const correctBody: getPostsResponse = {
      status: false,
      message: "endDate query must be defined.",
    };

    expect(body).toEqual(correctBody);
  });

  test("no page query", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        endDate: new Date(Date.now() + 99999999999),
      }),
      requestOptions
    );

    expect(response.status).toEqual(400);

    const body: getPostsResponse = await response.json();
    const correctBody: getPostsResponse = {
      status: false,
      message: "page query must be defined.",
    };

    expect(body).toEqual(correctBody);
  });

  test("route responses correct 1st page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.pageCount).toBe(2);
    expect(body.value.posts).toHaveLength(10);
  });

  test("route responses correct 2st page", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        endDate: new Date(Date.now() + 99999999999),
        page: 1,
      }),
      requestOptions
    );

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.pageCount).toBe(2);
    expect(body.value.posts).toHaveLength(5);
  });

  test("route responses correct 3st page", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        endDate: new Date(Date.now() + 99999999999),
        page: 2,
      }),
      requestOptions
    );

    expect(response.status).toEqual(400);

    const body: getPostsResponse = await response.json();
    const correctBody: getPostsResponse = {
      status: false,
      message: "Page does not exist.",
    };

    expect(body).toEqual(correctBody);
  });

  test("response only includes following users posts", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        endDate: new Date(Date.now() + 99999999999),
        page: 0,
      }),
      requestOptions
    );

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(
      body.value.posts.filter((e) => e.userId === testUserData2.id)
    ).toHaveLength(10);
  });
});
