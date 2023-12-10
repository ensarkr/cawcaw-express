type user_DB = {
  id: number;
  username: string;
  display_name: string;
  hashed_password: string;
  description: string;
};

type user = {
  id: number;
  username: string;
  displayName: string;
  description: string;
};

type userPartial = Omit<user, "description">;

export { user_DB, user, userPartial };
