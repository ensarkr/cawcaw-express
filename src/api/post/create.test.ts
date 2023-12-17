import "dotenv/config";
import {
  createPostRequestBody,
  createPostResponseBody,
} from "../../typings/http";
import { createJWT } from "../../functions/jwt";
import {
  deleteTestUsers,
  getPostsOfTestUser,
  insertTestUser,
  testUserData,
  testHost,
} from "../../functions/tests";
import fs from "fs";
import {
  checkJWT_TEST,
  checkEmptyBody_TEST,
} from "../../functions/globalTests";

const mainUrl = testHost + "/post/create";

describe("create post", () => {
  const requestBody: createPostRequestBody = {
    text: "Very long text.",
    isThereAnImage: "yes",
  };

  const formData = new FormData();
  formData.append("text", requestBody.text);
  formData.append("isThereAnImage", "yes");
  formData.append(
    "image",
    new File([fs.readFileSync("./testFiles/smallSize.jpg")], "sample", {
      type: "image/jpeg",
    }),
    "test"
  );

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      authorization: createJWT({
        id: testUserData.id,
        username: testUserData.username,
        displayName: testUserData.displayName,
      }),
    },
    body: formData,
  };

  beforeAll(async () => {
    await insertTestUser();
  });

  afterAll(async () => {
    await deleteTestUsers();
  });

  checkJWT_TEST(mainUrl, requestOptions);
  checkEmptyBody_TEST(mainUrl, requestOptions);

  test("text size exceeds 250 characters", async () => {
    const formData = new FormData();
    formData.append("text", new Array(251).fill("T").join());
    formData.append("isThereAnImage", "no");

    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: formData,
    });

    expect(response.status).toEqual(400);

    const body: createPostResponseBody = await response.json();
    const correctBody: createPostResponseBody = {
      status: false,
      message: "Text cannot be longer than 250 characters.",
    };

    expect(body).toEqual(correctBody);
  });

  test("file type is not supported", async () => {
    const formData = new FormData();
    formData.append("text", requestBody.text);
    formData.append("isThereAnImage", "yes");
    formData.append(
      "image",
      new File(
        [fs.readFileSync("./testFiles/differentFileType.txt")],
        "sample",
        { type: "application/text" }
      ),
      "test"
    );

    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: formData,
    });

    expect(response.status).toEqual(400);

    const body: createPostResponseBody = await response.json();
    const correctBody: createPostResponseBody = {
      status: false,
      message: "Only webp, png and jpg files are supported.",
    };

    expect(body).toEqual(correctBody);
  });

  test("image size exceeds 1MB", async () => {
    const formData = new FormData();
    formData.append("text", requestBody.text);
    formData.append("isThereAnImage", "yes");
    formData.append(
      "image",
      new File([fs.readFileSync("./testFiles/bigSize.webp")], "sample", {
        type: "image/webp",
      }),
      "test"
    );

    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: formData,
    });

    expect(response.status).toEqual(400);

    const body: createPostResponseBody = await response.json();
    const correctBody: createPostResponseBody = {
      status: false,
      message: "Image size cannot be bigger than 1MB.",
    };

    expect(body).toEqual(correctBody);
  }, 10000);

  test("isThereAnImage is yes but no image", async () => {
    const formData = new FormData();
    formData.append("text", requestBody.text);
    formData.append("isThereAnImage", "yes");

    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: formData,
    });

    expect(response.status).toEqual(400);

    const body: createPostResponseBody = await response.json();
    const correctBody: createPostResponseBody = {
      status: false,
      message: "Cannot access the image.",
    };

    expect(body).toEqual(correctBody);
  });

  test("post with only text is added to database", async () => {
    const formData = new FormData();
    formData.append("text", requestBody.text);
    formData.append("isThereAnImage", "no");

    const response = await fetch(mainUrl, {
      ...requestOptions,
      body: formData,
    });

    expect(response.status).toEqual(200);

    const posts = await getPostsOfTestUser();

    expect(posts[0].text).toBe(requestBody.text);
    expect(posts[0].image_url).toBeNull();
  });

  test("post is added to database and image_url accessible", async () => {
    const response = await fetch(mainUrl, {
      ...requestOptions,
    });

    expect(response.status).toEqual(200);

    const posts = await getPostsOfTestUser();

    expect(posts[1].text).toBe(requestBody.text);
    expect(posts[1].image_url !== null).toBe(true);
    console.log("image link", posts[1].image_url);
  }, 10000);
});
