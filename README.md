## Description

I use NestJS and MongoDB database to perform the test. I also use docker to build the project.

Unfortunately, I haven't been able to complete task 2 yet because I haven't had much exposure to XML, I probably need more time for task 2. I haven't been able to finish it yet.

I assumed that the database had customer reservation data to do task 3, which is payment with Vietcombank.

## Setup environment for project

In the root directory of the project, create a file ".env". Next, copy the content of the "env.txt" file that I attached in the email to the ".env" file you just created in the project.

## Running with docker

Requires a computer with Docker installed.

```bash
# run command
$ docker compose up
```

## Running normal

Computer requirements need to install NodeJS, NestJS and mongodb.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
