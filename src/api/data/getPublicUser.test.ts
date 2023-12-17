import "dotenv/config";
import { getUserResponse } from "../../typings/http";
import {
  deleteTestUsers,
  insertTestUser,
  testHost,
} from "../../functions/tests";

const mainUrl = testHost + "/data/user";

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get public user", () => {
  beforeAll(async () => {
    await insertTestUser();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  test("get existing user", async () => {
    const response = await fetch(mainUrl + "/0", requestOptions);

    expect(response.status).toEqual(200);

    const body: getUserResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.id).toBe(0);
  });

  test("get non-existent user", async () => {
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
