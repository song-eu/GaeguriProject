# Gaeguri-Server
Gaeguri Project is a communication application for Developers who want to find a team for side project. 

This server is based on TypeScript and Graphql Server for Gaeguri-Client.


## Table of Contents

- [Setup](#Setup)
- [Technologies](#Technologies)
- [Features](#Features)
- [Project Seed 추가 방법](#Project Seed 추가 방법)

## Setup
Before run :
 1. Please install mysql and check it is running on your computer or server
 2. Create '.env' configuration in the root folder
 3. Configure below information
 ```
DB_USERNAME= // Your DB user name
DB_PASSWORD= // Your DB password
MYSQL_SERVER= localhost // Your DB server IP
DB_NAME=gaeguri // Your DB Schema name
 ```

To run this project, install it locally using npm:

```
$ cd ../GaeguriProject
$ npm install
$ npm start
```

## Technologies

Project is created with:

- Graphql: 15.1.0
- Graphql-yoga: 1.18.3
- passport: 0.4.1
- typescript: 3.3.3333
- typeorm: 0.2.25
- multer: 1.4.2

## Features

This Gaeguri Server offer:

- Graphql Endpoint/Playground.
- Chat web socket using graphql Pub/Sub.
- Graphql Query and Mutation for Project and User.
- Graphql Docs for detail of Query, mutation and subscription.


## Project Seed 추가 방법
 1. npm i 
 2. .env configuration 추가
```
  TYPEORM_SEEDING_FACTORIES=src/seed/factory/*.factory.ts
  TYPEORM_SEEDING_SEEDS=src/seed/seed/*.seed.ts
```
 3. npm run seed:run
