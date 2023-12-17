import "dotenv/config";
import {
  likePostRequestBody,
  likePostResponseBody,
  jwtBadResponse,
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
} from "../../functions/tests";
import {
  checkEmptyBody_TEST,
  checkJWT_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/action/like";

const requestBody: likePostRequestBody = {
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

describe("like post", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });
  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("like post", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    const posts = await getPostsOfTestUser();

    expect(posts[0].likes_count).toEqual(1);
    expect(await getPostLikesOfTestUser()).toHaveLength(1);
  });

  test("like again", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(400);

    const body: likePostResponseBody = await response.json();
    const correctBody: likePostResponseBody = {
      status: false,
      message: "Already liked.",
    };

    expect(body).toEqual(correctBody);
  });
});
