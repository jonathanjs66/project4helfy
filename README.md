# The SRE helfy project


this is a small fullstack project i built for the SRE assignment.

the project shows a basic web application that runs with docker compose.
inside this application we have
frontend: basic html and css
backend : backend in node.js, with RESTful api
database: mysql
kafka: used for events
connect:debezium: to capture changed from MYSQL

Docker Compose runs 5 containers: client, api, mysql, kafka, connect / Debezium.
## ARchitecture

client --> nginx --> api --> mysql --> debezium -- > kafka


## schema

INSERT INTO `accounts` (`username`, `password`, `email`)
VALUES ('user1', 'password1', 'test@test.com');

the id is set automatically, 


## Installation

this application is running with docker compose so there is no need to download anything

docker compose up --build -d




## Usage

open login page: 'http://localhost:8080/login.html'

the user:
username: user1,
password: password1

the api check the username and password in the MYSQL database.

if the login is currect we get redirected to 

localhost:3000/home

## Logging

The API service uses `log4js` for application logging.

docker compose logs -f api

to see the file in the api container:

sudo docker exec -it healfy-api /bin/sh

password: rootpass

cat all-logs.log to see the api logs

in the logs we can see:
- when server started
- connection to mysql
- mysql connection errors
- database quary errors
---
## debezium logs  

docker compose logs -f connect

in the logs we can see:
- kafka conect startup
- connecton to kafka
- cdc connector activity

## kafka logs

docker compose logs -f kafka

in the logs we can see:
- broker status
- topic creation 
- kafka internal warning and errors


## notes about debezium and kafka
Kafka and Debezium are included in the docker compose setup.

Kafka starts as a single broker, and Debezium starts and connects to Kafka. The next step would be to register a MySQL Debezium connector so database changes can be captured and sent into Kafka topics.


## Contributing

no need, for a job interview

