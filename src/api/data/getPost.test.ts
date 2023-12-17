import "dotenv/config";
import { getPostResponse } from "../../typings/http";
import {
  deleteTestUser,
  insertPostByTestUser,
  insertTestUser,
  testHost,
} from "../../functions/tests";

const mainUrl = testHost + "/data/post";

const requestOptions: RequestInit = {
  method: "GET",
};

describe("get post", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  test("get existing post", async () => {
    const response = await fetch(mainUrl + "/0", requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) return false;

    expect(body.value.id).toBe(0);
  });

  test("get non-existing post", async () => {
    const response = await fetch(mainUrl + "/1", requestOptions);

    expect(response.status).toEqual(400);

    const body: getPostResponse = await response.json();
    const correctBody: getPostResponse = {
      status: false,
      message: "Post not found.",
    };

    expect(body).toEqual(correctBody);
  });
});
