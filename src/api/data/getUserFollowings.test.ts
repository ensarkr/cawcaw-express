import "dotenv/config";
import { getPageQuery, getUsersResponse } from "../../typings/http";
import {
  addTestFollowRelation,
  deleteTestUsers,
  insertTestUser,
  insertSecondTestUser,
  testHost,
  testUserData,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/user/" + testUserData.id + "/followings";

const requestQuery: getPageQuery = {
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  page: 0,
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get user followings ", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertSecondTestUser();
    await addTestFollowRelation();
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

    const body: getUsersResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.pageCount).toBe(1);
    expect(body.value.users).toHaveLength(1);
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

    const body: getUsersResponse = await response.json();
    const correctBody: getUsersResponse = {
      status: false,
      message: "Page does not exist.",
    };

    expect(body).toEqual(correctBody);
  });
});
