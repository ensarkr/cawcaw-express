type signUpRequestBody = {
  displayName: string;
  username: string;
  password: string;
  rePassword: string;
};

type signUpResponseBody = { message: string };

export { signUpRequestBody, signUpResponseBody };
