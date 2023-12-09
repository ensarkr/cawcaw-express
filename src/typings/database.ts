type user_DB = {
  id: number;
  username: number;
  display_name: string;
  hashed_password: string;
};

type user = {
  id: number;
  username: number;
  displayName: string;
};

export { user_DB, user };
