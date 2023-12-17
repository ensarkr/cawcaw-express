import "dotenv/config";
import { getPostsResponse, searchPostsQuery } from "../../typings/http";
import {
  deleteTestUsers,
  insertPrefilledPostsByTestUser,
  insertTestUser,
  testHost,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/posts/search";

const requestQuery: searchPostsQuery = {
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  page: 0,
  searchQuery: "test",
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get searched posts", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPrefilledPostsByTestUser();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  checkQueries_TEST(
    mainUrl,
    requestOptions,
    {
      endDate: true,
      page: true,
      searchQuery: true,
    },
    returnURLWithQueries
  );

  let nonExistentPage = 99999;

  test("route responds correct populated page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    nonExistentPage = body.value.pageCount;

    expect(body.value.posts.length > 0).toBe(true);

    expect(body.value.posts).toHaveLength(
      body.value.posts.filter((e) => e.text.includes(requestQuery.searchQuery))
        .length
    );
  });

  test("route responds correct non-existent page", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        ...requestQuery,
        page: nonExistentPage,
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
