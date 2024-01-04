function convertDatabaseUserToNormal(user) {
    return {
        id: user.id,
        displayName: user.display_name,
        username: user.username,
        description: user.description,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        requestedFollows: user.requested_follows !== undefined ? user.requested_follows : false,
    };
}
function convertDatabaseUsersToNormal(users) {
    const resultArray = [];
    for (let i = 0; i < users.length; i++) {
        resultArray.push(convertDatabaseUserToNormal(users[i]));
    }
    return resultArray;
}
function convertDatabaseUsersToPartial(users) {
    const resultArray = [];
    for (let i = 0; i < users.length; i++) {
        resultArray.push({
            id: users[i].id,
            username: users[i].username,
            displayName: users[i].display_name,
        });
    }
    return resultArray;
}
function convertDatabasePostToNormal(post) {
    return {
        id: post.id,
        userId: post.user_id,
        text: post.text,
        imageUrl: post.image_url,
        aspectRatio: post.aspect_ratio,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        insertedAt: new Date(post.inserted_at),
        displayName: post.display_name,
        username: post.username,
        requestedLiked: post.requested_liked !== undefined ? post.requested_liked : false,
    };
}
function convertDatabasePostsToNormal(posts) {
    const resultArray = [];
    for (let i = 0; i < posts.length; i++) {
        resultArray.push(convertDatabasePostToNormal(posts[i]));
    }
    return resultArray;
}
function convertDatabaseCommentToNormal(comment) {
    return {
        id: comment.id,
        userId: comment.user_id,
        postId: comment.post_id,
        comment: comment.comment,
        insertedAt: new Date(comment.inserted_at),
        displayName: comment.display_name,
        username: comment.username,
    };
}
function convertDatabaseCommentsToNormal(comments) {
    const resultArray = [];
    for (let i = 0; i < comments.length; i++) {
        resultArray.push(convertDatabaseCommentToNormal(comments[i]));
    }
    return resultArray;
}
function convertDateToDatabase(date) {
    return date.toISOString().replace("T", " ").slice(0, -1).concat("999");
}
function returnURLWithQueries(url, queryObject) {
    const keys = Object.keys(queryObject);
    url += "?";
    for (let i = 0; i < keys.length; i++) {
        if (i != 0) {
            url += "&";
        }
        url += keys[i] + "=" + encodeURIComponent(queryObject[keys[i]]);
    }
    return url;
}
export { convertDatabaseUserToNormal, convertDatabasePostToNormal, convertDateToDatabase, returnURLWithQueries, convertDatabasePostsToNormal, convertDatabaseUsersToPartial, convertDatabaseCommentsToNormal, convertDatabaseUsersToNormal, };
