import "dotenv/config";
import {
  getCommentsResponse,
  getPageQuery,
  getPostsResponse,
} from "../../typings/http";
import {
  deleteTestUsers,
  insertCommentsByTestUser,
  insertPostByTestUser,
  insertTestUser,
  testHost,
  testPostData,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/post/" + testPostData.id + "/comments";

const requestQuery: getPageQuery = {
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
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

    const body: getCommentsResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) {
      throw "Status is wrong";
    }
    
    expect(body.value.pageCount).toBe(1);
    expect(body.value.comments).toHaveLength(5);
    expect(typeof body.value.comments[0].displayName).toBe("string");
    expect(typeof body.value.comments[0].username).toBe("string");
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

    const body: getCommentsResponse = await response.json();
    const correctBody: getPostsResponse = {
      status: false,
      message: "Page does not exist.",
    };

    expect(body).toEqual(correctBody);
  });
});
