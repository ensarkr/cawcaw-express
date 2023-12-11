import "dotenv/config";
import {
  jwtBadResponse,
  removePostRequestBody,
  removePostResponseBody,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUser,
  getPostsByTestUser,
  insertTestUser,
  testUserData,
  testHost,
  testPostData,
  insertPostByTestUser,
} from "../../functions/tests";

const mainUrl = testHost + "/post/remove";

describe("remove post", () => {
  const requestBody: removePostRequestBody = {
    postId: testPostData.id,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      authorization: createJWT({
        id: testUserData.id,
        username: testUserData.username,
        displayName: testUserData.displayName,
      }),
    },
    body: JSON.stringify(requestBody),
  };

  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  test("no jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {},
    });

    expect(response.status).toEqual(401);

    const body: removePostRequestBody = await response.json();
    const correctBody: jwtBadResponse = {
      status: false,
      message: "Token cannot be found.",
    };

    expect(body).toEqual(correctBody);
  });

  test("tampered jwt", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      headers: {
        ...requestOptions.headers,
        authorization: "tampered-jwt",
      },
    });
    expect(response.status).toEqual(401);

    const body: removePostRequestBody = await response.json();
    const correctBody: removePostResponseBody = {
      status: false,
      message: "Tampered or expired token.",
      actions: ["deleteJWT"],
    };

    expect(body).toEqual(correctBody);
  });

  test("empty body", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: "",
    });

    expect(response.status).toEqual(400);

    const body: removePostRequestBody = await response.json();
    const correctBody: removePostResponseBody = {
      status: false,
      message: "Empty inputs.",
    };

    expect(body).toEqual(correctBody);
  });

  test("remove post", async () => {
    let posts = await getPostsByTestUser();

    expect(posts).toHaveLength(1);

    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    posts = await getPostsByTestUser();

    expect(posts).toHaveLength(0);
  });

  test("post does not exist", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
    });

    expect(response.status).toEqual(400);

    const body: removePostRequestBody = await response.json();
    const correctBody: removePostResponseBody = {
      status: false,
      message: "Post does not exist.",
    };

    expect(body).toEqual(correctBody);
  });
});
