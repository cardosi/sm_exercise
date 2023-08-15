# StrongMind Coding Exercise
Coding Exercise for StrongMind application process

# Requirements
- Python 3
- Docker

# Run Locally

## Start local DynamoDB instance
From the root directory run:
`docker run -p 8000:8000 amazon/dynamodb-local`

## Activate Python Virtual Environment
From the root directory run:
`. .venv/bin/activate`

## Install Python Requirements
From the root directory run:
`pip3 install -r api/requirements.txt`

## Start the Flask App
From the root directory run:
`flask --app api/app run`

# Tests

## Run Frontend Tests
Change directory to the client directory and run:
`npx vitest`

## Run Backend Tests
Change directory to the api directory and run:
`pytest`

# Local DynamoDB Management Script

This script, `local_db.py`, is a utility for managing a local instance of DynamoDB. It provides functionality for creating, deleting, truncating, and seeding tables.

## Tables

The script manages three tables:

- Pizzas
- Toppings
- PizzaToppings

Each table has a single attribute 'id' which is used as the primary key.

## Functions

The script provides the following functions:

- `create_tables`: Creates the tables.
- `delete_tables`: Deletes the tables if they exist.
- `truncate_tables`: Removes all items from the tables if they exist.
- `seed_tables`: Adds a single item to each of the tables if they exist. Each item has an 'id' of 1 and a 'name' of 'Sample data'.
- `build`: Deletes the tables if they exist and then creates new tables.
- `new`: Deletes the tables if they exist, creates new tables, and seeds the tables.

## Usage

To use the script, run it from the terminal with one of the following arguments:

- `build`: Deletes the tables if they exist and creates new tables.
- `truncate`: Removes all items from the tables if they exist.
- `seed`: Removes all items from the tables if they exist and then seeds the tables.
- `new`: Deletes the tables if they exist, creates new tables, and seeds the tables.

For example, to delete the tables if they exist, create new tables, and seed the tables, you would use the following command:

```
python3 local_db.py new
```

# Tests

## Run Frontend Tests
Change directory to the client directory and run:
`npx vitest`

## Run Backend Tests
Change directory to the api directory and run:
`pytest`