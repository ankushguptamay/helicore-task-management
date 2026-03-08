# Backend Service

Build a secure backend API for a medium-complexity task and workflow management system.

# Set UP

Node.js (v14.x or higher recommended)
MySQL Server
Npm

# Env 

Create .env.development and .env.production and set variable according to .env.example

# Database Setup

Create database and add the name and other credentials in env

# Run Migrations

npm run migration:generate -- {name} (Create migration on development)
npm run migration:run (Run migration on development)
npm run migration:undo (Rollback migration on development)

npm migration:run:prod (Run migration on production)
npm migration:undo:prod (Rollback migration on production)

# Seed Data

I created a seeder file which add a user (role=admin). For this first insure/set the password in env file the same user

npm run seed:generate -- {name} (Create seeder on development)
npm run seed:run (Run seeder on development)
npm seed:run:prod (Run seeder on production)

# Running the App

npm run dev (development)

npm start (production)

# API 
http://localhost:{port}/api/v1/auth/register
Post method 
This API is for admin to create/add user.

http://localhost:{port}/api/v1/auth/login
Post methos

http://localhost:{port}/api/v1/auth/logout
Post Method

http://localhost:{port}/api/v1/auth/users
get Method
This API for admin to seee users.

http://localhost:{port}/api/v1/task
Post Method
For Admin

http://localhost:{port}/api/v1/task
Get

http://localhost:{port}/api/v1/task/:id
Get

http://localhost:{port}/api/v1/task/:id
Put

http://localhost:{port}/api/v1/task/:id
Delete