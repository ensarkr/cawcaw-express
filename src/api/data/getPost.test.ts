import "dotenv/config";
import { getPostResponse } from "../../typings/http";
import {
  deleteTestUsers,
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
    await deleteTestUsers();
  });

  test("get existing post", async () => {
    const response = await fetch(mainUrl + "/0", requestOptions);

    expect(response.status).toEqual(200);

    const body: getPostResponse = await response.json();

    expect(body.status).toBe(true);

    if (!body.status) {
      throw "Status is wrong";
    }

    expect(body.value.id).toBe(0);
    expect(typeof body.value.username).toBe("string");
    expect(typeof body.value.requestedLiked).toBe("boolean");
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
