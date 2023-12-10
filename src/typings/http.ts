import { doubleReturn } from "./global.js";

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
};
