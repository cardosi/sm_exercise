import sys
import boto3

dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')


def table_exists(table_name):
    try:
        dynamodb.Table(table_name).load()
    except Exception as e:
        return False
    return True


def create_tables():
    tables = ['Pizzas', 'Toppings', 'PizzaToppings']
    for table in tables:
        dynamodb.create_table(
            TableName=table,
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                },
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'N'
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        )


def delete_tables():
    tables = ['Pizzas', 'Toppings', 'PizzaToppings']
    for table in tables:
        if table_exists(table):
            table = dynamodb.Table(table)
            table.delete()


def truncate_tables():
    tables = ['Pizzas', 'Toppings', 'PizzaToppings']
    for table_name in tables:
        if table_exists(table_name):
            table = dynamodb.Table(table_name)
            scan = table.scan()
            with table.batch_writer() as batch:
                for each in scan['Items']:
                    batch.delete_item(
                        Key={
                            'id': each['id']
                        }
                    )


def seed_tables():
    tables = ['Pizzas', 'Toppings', 'PizzaToppings']
    for table_name in tables:
        if table_exists(table_name):
            table = dynamodb.Table(table_name)
            table.put_item(
                Item={
                    'id': 1,
                    'name': 'Sample data'
                }
            )


def build():
    delete_tables()
    create_tables()


def new():
    build()
    seed_tables()


def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py [build|truncate|seed|new]")
        sys.exit(1)

    command = sys.argv[1]

    if command == 'build':
        build()
    elif command == 'truncate':
        truncate_tables()
    elif command == 'seed':
        truncate_tables()
        seed_tables()
    elif command == 'new':
        new()
    else:
        print(
            "Invalid command. Usage: python script.py [build|truncate|seed|new]")
        sys.exit(1)


if __name__ == "__main__":
    main()
