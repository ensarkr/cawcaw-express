type dbDate = string;

type user_DB = {
  id: number;
  username: string;
  display_name: string;
  hashed_password: string;
  description: string;
  followers_count: number;
  following_count: number;
  inserted_at: dbDate;
  requested_follows?: boolean;
};

type user = {
  id: number;
  username: string;
  displayName: string;
  description: string;
  followersCount: number;
  followingCount: number;
  requestedFollows: boolean;
};

type userPartial = Pick<user, "id" | "username" | "displayName">;

type followRelation_DB = {
  id: number;
  user_id: number;
  follows_id: number;
  inserted_at: dbDate;
};

type post_DB = {
  id: number;
  user_id: number;
  text: string;
  likes_count: number;
  comments_count: number;
  inserted_at: dbDate;
  username: string;
  display_name: string;
  requested_liked?: boolean;
} & (
  | { image_url: null; aspect_ratio: null }
  | { image_url: string; aspect_ratio: number }
);

type postLikes_DB = {
  id: number;
  user_id: number;
  post_id: number;
};

type postComment_DB = {
  id: number;
  user_id: number;
  post_id: number;
  comment: string;
  inserted_at: dbDate;
  username: string;
  display_name: string;
};

type postComment = {
  id: number;
  userId: number;
  postId: number;
  comment: string;
  insertedAt: Date;
  username: string;
  displayName: string;
};

type post = {
  id: number;
  userId: number;
  text: string;
  likesCount: number;
  commentsCount: number;
  insertedAt: Date;
  username: string;
  displayName: string;
  requestedLiked: boolean;
} & (
  | { imageUrl: null; aspectRatio: null }
  | { imageUrl: string; aspectRatio: number }
);

export {
  user_DB,
  user,
  userPartial,
  followRelation_DB,
  post_DB,
  postLikes_DB,
  postComment_DB,
  postComment,
  post,
};
