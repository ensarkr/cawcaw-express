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

type followRelation_DB = {
  id: number;
  user_id: number;
  follows_id: number;
};

type post_DB = {
  id: number;
  user_id: number;
  text: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
};

type postLikes_DB = {
  id: number;
  user_id: number;
  post_id: number;
};

export { user_DB, user, userPartial, followRelation_DB, post_DB, postLikes_DB };
