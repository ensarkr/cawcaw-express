import "dotenv/config";
import {
  commentOnPostRequestBody,
  commentOnPostResponseBody,
  jwtBadResponse,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUser,
  insertTestUser,
  testUserData,
  testHost,
  testPostData,
  getPostsByTestUser,
  getAllPostLikesByTestUser,
  insertPostByTestUser,
  getAllCommentsByTestUser,
} from "../../functions/tests";
import {
  checkEmptyBody_TEST,
  checkJWT_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/action/comment";

const requestBody: commentOnPostRequestBody = {
  postId: testPostData.id,
  comment: "Very insightful comment.",
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

describe("comment on post", () => {
  beforeAll(async () => {
    await insertTestUser();
    await insertPostByTestUser();
  });

  afterAll(async () => {
    await deleteTestUser();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("comment that is longer than 180 character", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: JSON.stringify({
        ...requestBody,
        comment: new Array(181).fill("T").join(),
      } as commentOnPostRequestBody),
    });

    expect(response.status).toEqual(400);

    const body: commentOnPostResponseBody = await response.json();
    const correctBody: commentOnPostResponseBody = {
      status: false,
      message: "Comment cannot be longer than 180 characters.",
    };

    expect(body).toEqual(correctBody);
  });

  test("comment", async () => {
    const response = await fetch(mainUrl, requestOptions);

    expect(response.status).toEqual(200);

    const comments = await getAllCommentsByTestUser();
    const posts = await getPostsByTestUser();

    expect(comments).toHaveLength(1);
    expect(comments[0].comment).toBe(requestBody.comment);
    expect(comments[0].post_id).toBe(requestBody.postId);
    expect(posts[0].comments_count).toBe(1);
  });
});
