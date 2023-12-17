import "dotenv/config";
import { getPageQuery, getPostsResponse } from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  addTestFollowRelation,
  deleteTestUsers,
  insertPostsByTestUser,
  insertPostsBySecondTestUser,
  insertTestUser,
  insertSecondTestUser,
  testHost,
  testUserData,
  secondTestUser,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkJWT_TEST, checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/posts/following";

const requestQuery: getPageQuery = {
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
    await insertSecondTestUser();
    await addTestFollowRelation();
    await insertPostsByTestUser(15);
    await insertPostsBySecondTestUser(15);
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  checkJWT_TEST(mainUrl, requestOptions);
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

  let nonExistentPage = 99999999;

  test("route responses correct populated page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.posts).toHaveLength(10);
    nonExistentPage = body.value.pageCount;

    expect(
      body.value.posts.filter((e) => e.userId === secondTestUser.id)
    ).toHaveLength(10);
  });

  test("route responses correct nonExistentPage page", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        ...requestQuery,
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
