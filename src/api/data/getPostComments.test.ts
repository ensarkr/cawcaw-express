import "dotenv/config";
import {
  getCommentsResponse,
  getPostsQuery,
  getPostsResponse,
  searchPostsQuery,
} from "../../typings/http";
import {
  addFollowRelation,
  deletePrefilledUsers,
  deleteTestUser,
  deleteTestUser2,
  insertCommentsByTestUser,
  insertPostByTestUser,
  insertPostsByTestUser,
  insertPrefilledUsers,
  insertTestUser,
  insertTestUser2,
  testHost,
  testPostData,
  testUserData,
  testUserData2,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/post/" + testPostData.id + "/comments";

const requestQuery: getPostsQuery = {
  endDate: new Date(Date.now() + 99999999999),
  page: 0,
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get post comments ", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
    await insertCommentsByTestUser(5);
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

  test("route responds correct 1st page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getCommentsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.pageCount).toBe(1);
    expect(body.value.comments).toHaveLength(5);
  });

  test("route responds correct 2st page", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        ...requestQuery,
        page: 1,
      }),
      requestOptions
    );

    expect(response.status).toEqual(400);

    const body: getCommentsResponse = await response.json();
    const correctBody: getPostsResponse = {
      status: false,
      message: "Page does not exist.",
    };

    expect(body).toEqual(correctBody);
  });
});
