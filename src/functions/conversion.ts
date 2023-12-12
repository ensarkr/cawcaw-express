import {
  user_DB,
  user,
  post_DB,
  post,
  userPartial,
} from "../typings/database.js";

function convertDatabaseUserToNormal(user: user_DB): user {
  return {
    id: user.id,
    displayName: user.display_name,
    username: user.username,
    description: user.description,
    followersCount: user.followers_count,
    followingCount: user.following_count,
  };
}

function convertDatabaseUsersToPartial(users: user_DB[]): userPartial[] {
  const resultArray: userPartial[] = [];

  for (let i = 0; i < users.length; i++) {
    resultArray.push({
      id: users[i].id,
      username: users[i].username,
      displayName: users[i].display_name,
    });
  }
  return resultArray;
}

function convertDatabasePostToNormal(post: post_DB): post {
  return {
    id: post.id,
    userId: post.user_id,
    text: post.text,
    imageUrl: post.image_url,
    likesCount: post.likes_count,
    commentsCount: post.comments_count,
  };
}

function convertDatabasePostsToNormal(posts: post_DB[]): post[] {
  const resultArray: post[] = [];

  for (let i = 0; i < posts.length; i++) {
    resultArray.push({
      id: posts[i].id,
      userId: posts[i].user_id,
      text: posts[i].text,
      imageUrl: posts[i].image_url,
      likesCount: posts[i].likes_count,
      commentsCount: posts[i].comments_count,
    });
  }
  return resultArray;
}

function convertDateToDatabase(date: Date) {
  return date.toISOString().split("T")[0];
}

function returnURLWithQueries(url: string, queryObject: Record<string, any>) {
  const keys = Object.keys(queryObject);

  url += "?";

  for (let i = 0; i < keys.length; i++) {
    if (i != 0) {
      url += "&";
    }

    url += keys[i] + "=" + queryObject[keys[i]];
  }

  return url;
}
export {
  convertDatabaseUserToNormal,
  convertDatabasePostToNormal,
  convertDateToDatabase,
  returnURLWithQueries,
  convertDatabasePostsToNormal,
  convertDatabaseUsersToPartial,
};
