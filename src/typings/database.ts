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
  followersCount: number;
  followingCount: number;
};

type userPartial = Pick<user, "id" | "username" | "displayName">;

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

type postComments_DB = {
  id: number;
  user_id: number;
  post_id: number;
  comment: string;
};

export {
  user_DB,
  user,
  userPartial,
  followRelation_DB,
  post_DB,
  postLikes_DB,
  postComments_DB,
};
