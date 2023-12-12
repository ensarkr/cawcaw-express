import "dotenv/config";
import { getUsersResponse, searchPostsQuery } from "../../typings/http";
import {
  deletePrefilledUsers,
  insertPrefilledUsers,
  testHost,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";

const mainUrl = testHost + "/data/users/search";

const requestQuery: searchPostsQuery = {
  endDate: new Date(Date.now() + 99999999999),
  page: 0,
  searchQuery: "test",
};

const requestUrl = returnURLWithQueries(mainUrl, requestQuery);

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get searched users", () => {
  beforeAll(async () => {
    await insertPrefilledUsers();
  });

  afterAll(async () => {
    await deletePrefilledUsers();
  });

  test("no queries", async () => {
    const response = await fetch(mainUrl, requestOptions);
    expect(response.status).toEqual(400);

    const body: getUsersResponse = await response.json();
    const correctBody: getUsersResponse = {
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

    const body: getUsersResponse = await response.json();
    const correctBody: getUsersResponse = {
      status: false,
      message: "page query must be defined.",
    };

    expect(body).toEqual(correctBody);
  });

  test("no searchQuery query", async () => {
    const response = await fetch(
      returnURLWithQueries(mainUrl, {
        endDate: new Date(Date.now() + 99999999999),
        page: 0,
      }),
      requestOptions
    );

    expect(response.status).toEqual(400);

    const body: getUsersResponse = await response.json();
    const correctBody: getUsersResponse = {
      status: false,
      message: "searchQuery query must be defined.",
    };

    expect(body).toEqual(correctBody);
  });

  test("route responds correct 1st page", async () => {
    const response = await fetch(requestUrl, requestOptions);

    expect(response.status).toEqual(200);

    const body: getUsersResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.pageCount).toBe(1);
    expect(body.value.users).toHaveLength(6);
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

    const body: getUsersResponse = await response.json();
    const correctBody: getUsersResponse = {
      status: false,
      message: "Page does not exist.",
    };

    expect(body).toEqual(correctBody);
  });
});
