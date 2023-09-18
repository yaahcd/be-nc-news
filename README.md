# Northcoders News API

Here is a link to the back-end version of this project that is being hosted in render: https://newsbe.onrender.com/api.

This is API runs a blog themed database that allows users to interact with articles that have been posted by commenting and voting. It also allows user to filter and sort articles as well as add comments, update comments and delete comments. For more information on all the endpoints available please visit /api on thee above specified link.

In order the run this project it is necessary to add .env.test and .env.development files with the corresponding database names (please check setup.sql file for the correct database names).

You will also need the following dependencies to run the project:
    "dotenv": "^16.0.0",
    "pg": "^8.7.3",
    "express": "^4.18.2".
  
This project has been developed using TDD and tests can be run if jest/jest sorted/supertest are installed.

Finally, Node and Postgres will need to be at least at version 20.3.0 and 14.8, respectively.
