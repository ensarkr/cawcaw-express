import "dotenv/config";
import { getPageQuery, getPostsResponse } from "../../typings/http";
import {
  addLikeByTestUser,
  deleteTestUsers,
  insertPostByTestUser,
  insertPostsByTestUser,
  insertTestUser,
  testHost,
  testUserData,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";
import { createJWT } from "../../functions/jwt";

const mainUrl = testHost + "/data/posts/explore";

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

describe("get explore posts", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
    await addLikeByTestUser();
    await insertPostsByTestUser(15);
  });

  afterAll(async () => {
    await deleteTestUsers();
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

  let nonExistentPage = 99999999;

  test("route responses correct populated page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) {
      throw "Status is wrong";
    }

    expect(body.value.posts).toHaveLength(10);
    expect(typeof body.value.posts[0].username).toBe("string");
    expect(typeof body.value.posts[0].requestedLiked).toBe("boolean");
    nonExistentPage = body.value.pageCount;
  });

  test("route responses correct non-existent page", async () => {
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
