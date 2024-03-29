import "dotenv/config";
import {
  unlikePostRequestBody,
  unlikePostResponseBody,
  jwtBadResponse,
  likePostResponseBody,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUsers,
  insertTestUser,
  testUserData,
  testHost,
  testPostData,
  getPostsOfTestUser,
  getPostLikesOfTestUser,
  insertPostByTestUser,
  addLikeByTestUser,
} from "../../functions/tests";
import {
  checkEmptyBody_TEST,
  checkJWT_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/action/unlike";

const requestBody: unlikePostRequestBody = {
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

describe("unlike post", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
    await addLikeByTestUser();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("unlike post", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    const posts = await getPostsOfTestUser();

    expect(posts[0].likes_count).toEqual(0);
    expect(await getPostLikesOfTestUser()).toHaveLength(0);
  });

  test("unlike again", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(400);

    const body: likePostResponseBody = await response.json();
    const correctBody: likePostResponseBody = {
      status: false,
      message: "Already unliked.",
    };

    expect(body).toEqual(correctBody);
  });
});
