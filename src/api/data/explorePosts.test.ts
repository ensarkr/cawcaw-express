import "dotenv/config";
import { getPostsQuery, getPostsResponse } from "../../typings/http";
import { decodeJWTPayload } from "../../functions/jwt";
import {
  deleteTestUser,
  insertPostByTestUser,
  insertPostsByTestUser,
  insertTestUser,
  testHost,
  testUserData,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkJWT_TEST, checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/posts/explore";

const requestQuery: getPostsQuery = {
  endDate: new Date(Date.now() + 99999999999),
  page: 0,
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get explore posts", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostsByTestUser(15);
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  checkQueries_TEST(
    mainUrl,
    requestOptions,
    {
      page: true,
      endDate: true,
      searchQuery: false,
    },
    returnURLWithQueries
  );

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
});
