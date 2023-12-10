type user_DB = {
  id: number;
  username: string;
  display_name: string;
  hashed_password: string;
  description: string;
  followers_count: number;
  following_count: number;
};

type user = {
  id: number;
  username: string;
  displayName: string;
  description: string;
};

type userPartial = Omit<
  user,
  "description" | "followers_count" | "following_count"
>;

type followRelation = {
  id: number;
  user_id: number;
  follows_id: number;
};

export { user_DB, user, userPartial, followRelation };
