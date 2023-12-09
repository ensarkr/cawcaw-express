type signUpRequestBody = {
  displayName: string;
  username: string;
  password: string;
  rePassword: string;
};

type signUpResponseBody = { message: string };

type signInRequestBody = {
  username: string;
  password: string;
};

type signInResponseBody = { message: string; jwtToken?: string };

export {
  signUpRequestBody,
  signUpResponseBody,
  signInRequestBody,
  signInResponseBody,
};
