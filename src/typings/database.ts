type user_DB = {
  id: number;
  username: string;
  display_name: string;
  hashed_password: string;
};

type user = {
  id: number;
  username: string;
  displayName: string;
};

export { user_DB, user };
