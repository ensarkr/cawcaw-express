import "dotenv/config";
import { getUserResponse } from "../../typings/http";
import {
  addTestFollowRelation,
  deleteTestUsers,
  insertSecondTestUser,
  insertTestUser,
  testHost,
  testUserData,
} from "../../functions/tests";
import { createJWT } from "../../functions/jwt";

const mainUrl = testHost + "/data/user";

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

describe("get public user", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertSecondTestUser();
    await addTestFollowRelation();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  test("get existing user", async () => {
    const response = await fetch(mainUrl + "/1", requestOptions);

    expect(response.status).toEqual(200);

    const body: getUserResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) {
      throw "Status is wrong";
    }

    expect(body.value.id).toBe(1);
    expect(body.value.requestedFollows).toBe(true);
    expect(body.value.followersCount).toBe(1);
  });

  test("get non-existent user", async () => {
    const response = await fetch(mainUrl + "/2", requestOptions);

    expect(response.status).toEqual(400);

    const body: getUserResponse = await response.json();
    const correctBody: getUserResponse = {
      status: false,
      message: "User not found.",
    };

    expect(body).toEqual(correctBody);
  });
});
