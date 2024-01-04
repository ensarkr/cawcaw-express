import "dotenv/config";
import { getPageQuery, getUsersResponse } from "../../typings/http";
import {
  addTestFollowRelation,
  deleteTestUsers,
  insertTestUser,
  insertSecondTestUser,
  testHost,
  secondTestUser,
  testUserData,
  addTestFollowItself,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";
import { checkQueries_TEST } from "../../functions/globalTests";
import { createJWT } from "../../functions/jwt";

const mainUrl = testHost + "/data/user/" + secondTestUser.id + "/followers";

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

describe("get user followers ", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertSecondTestUser();
    await addTestFollowRelation();
    await addTestFollowItself();
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

    if (!body.status) {
      throw "Status is wrong";
    }

    expect(body.value.pageCount).toBe(1);
    expect(body.value.users).toHaveLength(1);
    expect(body.value.users[0].username).toBe(testUserData.username);
    expect(body.value.users[0].requestedFollows).toBe(true);
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
