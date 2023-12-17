import "dotenv/config";
import {
  removePostRequestBody,
  removePostResponseBody,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUsers,
  getPostsOfTestUser,
  insertTestUser,
  testUserData,
  testHost,
  testPostData,
  insertPostByTestUser,
} from "../../functions/tests";
import {
  checkJWT_TEST,
  checkEmptyBody_TEST,
} from "../../functions/globalTests";

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
    await deleteTestUsers();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("remove post", async () => {
    let posts = await getPostsOfTestUser();

    expect(posts).toHaveLength(1);

    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    posts = await getPostsOfTestUser();

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
