import "dotenv/config";
import { getUsersResponse, searchPostsQuery } from "../../typings/http";
import {
  deleteTestUsers,
  insertPrefilledTestUsers,
  testHost,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";

const mainUrl = testHost + "/data/users/search";

const requestQuery: searchPostsQuery = {
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  page: 0,
  searchQuery: "test",
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get searched users", () => {
  beforeAll(async () => {
    await insertPrefilledTestUsers();
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
      searchQuery: true,
    },
    returnURLWithQueries
  );

  let nonExistentPage = 99999;

  test("route responds correct populated page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getUsersResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) {
      throw "Status is wrong";
    }

    nonExistentPage = body.value.pageCount;

    expect(body.value.users.length > 0).toBe(true);

    expect(body.value.users).toHaveLength(
      body.value.users.filter(
        (e) =>
          e.displayName.includes(requestQuery.searchQuery) ||
          e.username.includes(requestQuery.searchQuery)
      ).length
    );
    expect(body.value.users[0].requestedFollows).toBe(false);
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

    const body: getUsersResponse = await response.json();
    const correctBody: getUsersResponse = {
      status: false,
      message: "Page does not exist.",
    };

    expect(body).toEqual(correctBody);
  });
});
