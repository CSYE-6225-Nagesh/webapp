# CSYE 6225 - Cloud Native Web Application

Rest API's created using Express.js to get, create, update Users with mysql Database

## Setup instructions

Install node and mysql in your local machine

Clone the repository

`cd webapp`

### Install npm dependencies

`npm install`

Install pm2 for running in prod mode

`npm i -g pm2`

### create .env file with values

```
DB_USER_NAME=xxxx

DB_PASSWORD=xxxx

DB_HOST=xxxx

PORT=xxxx

DB_NAME=xxx

```

### Run the application

For dev mode

`npm run dev`

For production

`npm run prod`
