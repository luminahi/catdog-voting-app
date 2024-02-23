# Dockerized Voting App

An application for voting on cats or dogs, using containerized Node.js, Redis, PostgreSQL and Nginx.

Nginx serves as a simple web server. Each vote is placed in a queue in Redis, processed by a separate container named 'worker' and then stored in PostgreSQL.

Check localhost:8080 to vote.

To view the votes, navigate to localhost:3000/results.

Feel free to customize the .env file by choosing a new name for the user and database. After cloning the repository, simply navigate to the project folder and execute 'docker compose up.'
