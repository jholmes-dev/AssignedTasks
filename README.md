# Assigned Tasks

A collaborative task list designed to be ran on a Raspberry Pi with a small touch screen. 

## Front-end

Front end is built with Angular v18

## Back-end

Back-end is built using .NET 8.0

## Database

I recommend using Docker's Postgres container:

```
docker run --name asstasks-postgres -e POSTGRES_PASSWORD=rootroot -e POSTGRES_USER=root -e POSTGRES_DB=asstasks_db -p 5432:5432 -d postgres
```