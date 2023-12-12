import "dotenv/config";
import {
  getPostsQuery,
  getPostsResponse,
  getUserResponse,
  jwtBadResponse,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  addFollowRelation,
  deleteTestUser,
  deleteTestUser2,
  insertPostsByTestUser,
  insertPostsByTestUser2,
  insertTestUser,
  insertTestUser2,
  testHost,
  testUserData,
  testUserData2,
} from "../../functions/tests";
import { returnURLWithQueries } from "../../functions/conversion";

const mainUrl = testHost + "/data/user";

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get public user", () => {
  beforeAll(async () => {
    await insertTestUser();
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  test("get existing user", async () => {
    const response = await fetch(mainUrl + "/0", requestOptions);

    expect(response.status).toEqual(200);

    const body: getUserResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.id).toBe(0);
  });

  test("get non-existing user", async () => {
    const response = await fetch(mainUrl + "/1", requestOptions);

    expect(response.status).toEqual(400);

    const body: getUserResponse = await response.json();
    const correctBody: getUserResponse = {
      status: false,
      message: "User not found.",
    };

    expect(body).toEqual(correctBody);
  });
});
