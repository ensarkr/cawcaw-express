import "dotenv/config";
import { getPageQuery, getPostsResponse } from "../../typings/http";
import {
  addLikeByTestUser,
  deleteTestUsers,
  insertPostByTestUser,
  insertPostsBySecondTestUser,
  insertTestUser,
  secondTestUser,
  testHost,
  testUserData,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";
import { createJWT } from "../../functions/jwt";

const mainUrl = testHost + "/data/user/" + testUserData.id + "/likes";

const requestQuery: getPageQuery = {
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  page: 0,
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
  headers: {
    authorization: createJWT({
      id: secondTestUser.id,
      username: secondTestUser.username,
      displayName: secondTestUser.displayName,
    }),
  },
};

describe("get user likes ", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
    await addLikeByTestUser();
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

  test("route responds correct populated page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) {
      throw "Status is wrong";
    }

    expect(body.value.pageCount).toBe(1);
    expect(body.value.posts).toHaveLength(1);
    expect(body.value.posts[0].likesCount).toBe(1);
  });

  test("route responds correct non-existent page", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        ...requestQuery,
        page: 1,
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
