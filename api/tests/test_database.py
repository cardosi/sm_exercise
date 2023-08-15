import pytest
from unittest.mock import MagicMock
from database import DynamoDBClient


class TestDynamoDBClient:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.table_name = 'test_table'
        self.client = DynamoDBClient(self.table_name)
        self.client.table = MagicMock()

    def test_get_all_items(self):
        response = {'Items': [{'id': 1, 'name': 'item1'},
                              {'id': 2, 'name': 'item2'}]}
        self.client.table.scan.return_value = response

        items = self.client.get_all_items()

        assert items == response['Items']
        self.client.table.scan.assert_called_once()

    def test_get_item(self):
        key = {'id': 1}
        response = {'Item': {'id': 1, 'name': 'item1'}}
        self.client.table.get_item.return_value = response

        item = self.client.get_item(key)

        assert item == response['Item']
        self.client.table.get_item.assert_called_once_with(Key=key)

    def test_create_item(self):
        item = {'id': 1, 'name': 'item1'}
        self.client.create_item(item)

        self.client.table.put_item.assert_called_once_with(Item=item)

    def test_update_item(self):
        item = {'id': 1, 'name': 'item1'}
        self.client.update_item(item)

        self.client.table.put_item.assert_called_once_with(Item=item)

    def test_delete_item(self):
        key = {'id': 1}
        self.client.delete_item(key)

        self.client.table.delete_item.assert_called_once_with(Key=key)
