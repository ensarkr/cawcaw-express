# cawcaw-express

## About

Backend express server for my [react-native project](https://github.com/ensarkr/cawcaw-react-native).

## Features

- Auth with JWT tokens.
- Users can create posts. Posts can include 1MB image.
- Posts can be liked and commented on.
- User can follow each other.
- Posts and users can be searched.
- Existing datas can be fetched.

## Routes

jwt check (401 if not valid) = JC,
jwt check passthrough = JCP

- action

  - follow - follow user (JC)
  - unfollow - unfollow user (JC)
  - like - like post (JC)
  - unlike - unlike post (JC)
  - comment - comment on a post (JC)

- auth

  - signUp - sign up
  - signIn - sign in

- data

  - posts/explore - get latest posts (JCP)
  - posts/following - get latests posts that posted by users that the user follows (JC)
  - posts/search - search posts (JCP)
  - users/search - search users (JCP)
  - user/:id - get user details (JCP)
  - user/:id/followers - get user followers (JCP)
  - user/:id/followings - get user followings (JCP)
  - user/:id/posts - get posts that the user created (JCP)
  - user/:id/likes - get posts that the user liked (JCP)
  - user/:id/comments - get the users comments
  - post/:id/comments - get comments of the post
  - post/:id - get the post (JCP)

- post

  - create - create post (JC)
  - remove - remove post (JC)

- profile

  - edit - edit profile (JC)
  - editPassword - edit password (JC)

## Live Demo

Vercel api url = https://cawcaw-express.vercel.app/api

- Some examples
  - [Get latest posts that posted before 06/01/2025](https://cawcaw-express.vercel.app/api/data/posts/explore?endDate=Sat%20Jan%2006%202025%2001%3A35%3A15%20GMT%2B0300%20(GMT%2B03%3A00)&page=0)
  - [Search users that contains Alex](https://cawcaw-express.vercel.app/api/data/users/search?endDate=Sat%20Jan%2006%202025%2001%3A35%3A15%20GMT%2B0300%20(GMT%2B03%3A00)&searchQuery=Alex&page=0)

## To Run Locally

```
$ npm install
```

1. Follow this [Vercel Doc](https://vercel.com/docs/storage/vercel-postgres/quickstart) to create database and connect to the project.
2. Use cawcaw_setup.sql file inside setup folder to setup database schemas.
3. Create Cloudinary account.
4. Move .env.example to root folder from setup folder.
5. Remove .example and fill the blanks, JWT_SECRET can be any string like uuid.

```
$ npm start
```

After this api is locally accessible on http://localhost:5000/api/

## To Test

Both local server and Vercel api can be tested.
It is chosen inside src/functions/tests.ts, testHost variable can be localHost or vercelHost.
There are tests for all api endpoints.

```
<!-- to run all tests -->
$ npm test

<!-- to run specific tests -->
$ npm test ./src/api/<route to the test file>
```

## Technologies

- Express
- Vercel Postgres
- Cloudinary
- ts-jest
- TypeScript
