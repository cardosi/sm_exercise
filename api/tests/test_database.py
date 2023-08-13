import unittest
from unittest.mock import MagicMock
from database import DynamoDBClient

class DynamoDBClientTests(unittest.TestCase):
    def setUp(self):
        self.table_name = 'test_table'
        self.client = DynamoDBClient(self.table_name)
        self.client.table = MagicMock()

    def test_get_all_items(self):
        response = {'Items': [{'id': 1, 'name': 'item1'}, {'id': 2, 'name': 'item2'}]}
        self.client.table.scan.return_value = response

        items = self.client.get_all_items()

        self.assertEqual(items, response['Items'])
        self.client.table.scan.assert_called_once()

    def test_get_item(self):
        key = {'id': 1}
        response = {'Item': {'id': 1, 'name': 'item1'}}
        self.client.table.get_item.return_value = response

        item = self.client.get_item(key)

        self.assertEqual(item, response['Item'])
        self.client.table.get_item.assert_called_once_with(Key=key)

    def test_batch_get_item(self):
        keys = [{'id': 1}, {'id': 2}]
        response = {'Responses': {self.table_name: [{'id': 1, 'name': 'item1'}, {'id': 2, 'name': 'item2'}]}}
        self.client.table.batch_get_item.return_value = response

        items = self.client.batch_get_item(keys)

        self.assertEqual(items, response['Responses'][self.table_name])
        self.client.table.batch_get_item.assert_called_once_with(RequestItems={self.table_name: {'Keys': keys}})

    def test_query_table(self):
        key = 'id'
        value = 1
        response = {'Items': [{'id': 1, 'name': 'item1'}, {'id': 1, 'name': 'item2'}]}
        self.client.table.scan.return_value = response

        items = self.client.query_table(key, value)

        self.assertEqual(items, response['Items'])
        self.client.table.scan.assert_called_once_with(FilterExpression=boto3.dynamodb.conditions.Key(key).eq(value))

    def test_create_item(self):
        item = {'id': 1, 'name': 'item1'}
        self.client.create_item(item)

        self.client.table.put_item.assert_called_once_with(Item=item)

    def test_update_item(self):
        key = {'id': 1}
        item = {'attribute1': 'value1'}
        self.client.update_item(key, item)

        self.client.table.update_item.assert_called_once_with(
            Key=key,
            UpdateExpression='SET #attr1 = :val1',
            ExpressionAttributeNames={'#attr1': 'attribute1'},
            ExpressionAttributeValues={':val1': item['attribute1']}
        )

    def test_delete_item(self):
        key = {'id': 1}
        self.client.delete_item(key)

        self.client.table.delete_item.assert_called_once_with(Key=key)

if __name__ == '__main__':
    unittest.main()