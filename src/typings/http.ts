import { post, postComment, user, userPartial } from "./database.js";
import { doubleReturn } from "./global.js";

// * POST

type clientActions = "deleteJWT";

type action = {
  actions?: clientActions[];
};

type signUpRequestBody = {
  displayName: string;
  username: string;
  password: string;
  rePassword: string;
};

type signUpResponseBody = doubleReturn<undefined> & action;

type signInRequestBody = {
  username: string;
  password: string;
};

type jwtToken = string;

type signInResponseBody = doubleReturn<jwtToken> & action;

type editProfileRequestBody = {
  displayName: string;
  username: string;
  description: string;
};

type editProfileResponseBody = doubleReturn<jwtToken> & action;

type editPasswordRequestBody = {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
};

type editPasswordResponseBody = doubleReturn<undefined> & action;

type jwtBadResponse = doubleReturn<undefined> & action;

type followUserRequestBody = {
  targetId: number;
};

type followUserResponseBody = doubleReturn<undefined> & action;

type unfollowUserRequestBody = {
  targetId: number;
};

type unfollowUserResponseBody = doubleReturn<undefined> & action;

type createPostRequestBody = {
  text: string;
  isThereAnImage: "yes" | "no";
};

type createPostResponseBody = doubleReturn<{ postId: number }> & action;

type removePostRequestBody = {
  postId: number;
};

type removePostResponseBody = doubleReturn<undefined> & action;

type likePostRequestBody = {
  postId: number;
};

type likePostResponseBody = doubleReturn<undefined> & action;

type unlikePostRequestBody = {
  postId: number;
};

type unlikePostResponseBody = doubleReturn<undefined> & action;

type commentOnPostRequestBody = {
  postId: number;
  comment: string;
};

type commentOnPostResponseBody = doubleReturn<postComment> & action;

// * GET

type getPageQuery = {
  endDate: Date;
  page: number;
};

type getPostsResponse = doubleReturn<{
  posts: post[];
  pageCount: number;
}> &
  action;

type searchPostsQuery = { searchQuery: string } & getPageQuery;

type searchUsersQuery = {
  searchQuery: string;
} & getPageQuery;

type getUsersResponse = doubleReturn<{
  users: user[];
  pageCount: number;
}> &
  action;

type getUserResponse = doubleReturn<user> & action;
type getPostResponse = doubleReturn<post> & action;

type getCommentsResponse = doubleReturn<{
  comments: postComment[];
  pageCount: number;
}> &
  action;

export {
  signUpRequestBody,
  signUpResponseBody,
  signInRequestBody,
  signInResponseBody,
  editProfileRequestBody,
  editProfileResponseBody,
  editPasswordRequestBody,
  editPasswordResponseBody,
  jwtBadResponse,
  followUserRequestBody,
  followUserResponseBody,
  unfollowUserRequestBody,
  unfollowUserResponseBody,
  createPostRequestBody,
  createPostResponseBody,
  removePostRequestBody,
  removePostResponseBody,
  likePostRequestBody,
  likePostResponseBody,
  unlikePostRequestBody,
  unlikePostResponseBody,
  commentOnPostRequestBody,
  commentOnPostResponseBody,
  getPageQuery,
  getPostsResponse,
  searchPostsQuery,
  searchUsersQuery,
  getUsersResponse,
  getUserResponse,
  getCommentsResponse,
  getPostResponse,
};
