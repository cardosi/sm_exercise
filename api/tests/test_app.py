import pytest
from flask import Flask, json
from unittest.mock import patch
from app import app
from database import DynamoDBClient

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('database.DynamoDBClient.get_all_items')
def test_get_pizzas(mock_get_all_items, client):
    mock_get_all_items.return_value = [
        {
            "id": 1,
            "name": "Sample Pizza 1",
            "created_at": "2021-01-01T00:00:00Z",
            "updated_at": "2021-01-01T00:00:00Z"
        },
        {
            "id": 2,
            "name": "Sample Pizza 2",
            "created_at": "2021-01-01T00:00:00Z",
            "updated_at": "2021-01-01T00:00:00Z"
        }
    ]

    response = client.get('/pizzas')
    data = json.loads(response.data)
    assert response.status_code == 200, f"Failed with {response.status_code}, message: {response.data}"
    assert len(data) == 2, "Should return 2 pizzas"
    assert data[0]['name'] == "Sample Pizza 1", "First pizza name does not match"
    assert data[1]['name'] == "Sample Pizza 2", "Second pizza name does not match"
    assert data[0]['links'][0]['href'] == 'http://localhost/pizzas/1', 'First pizza self link is incorrect'
    assert data[0]['links'][1]['href'] == 'http://localhost/pizzas/1', 'First pizza update link is incorrect'
    assert data[0]['links'][2]['href'] == 'http://localhost/pizzas/1', 'First pizza delete link is incorrect'

def test_post_pizzas(client):
    pizza = {
        "id": 1,
        "name": "Test Pizza",
        "description": "This is a test pizza"
    }
    response = client.post('/pizzas', json=pizza)
    data = json.loads(response.data)
    assert response.status_code == 201, f"Failed with {response.status_code}, message: {response.data}"
    assert data['id'] == pizza['id'], "Returned pizza ID does not match"
    assert data['name'] == pizza['name'], "Returned pizza name does not match"
    assert data['description'] == pizza['description'], "Returned pizza description does not match"

@patch('database.DynamoDBClient.get_item')
def test_get_pizza(mock_get_item, client):
    mock_get_item.return_value = {
        "id": 1,
        "name": "Sample Pizza 1",
        "created_at": "2021-01-01T00:00:00Z",
        "updated_at": "2021-01-01T00:00:00Z"
    }
    response = client.get('/pizzas/1')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['id'] == 1
    assert data['name'] == "Sample Pizza 1"
    assert data['links'][0]['href'] == 'http://localhost/pizzas/1'
    assert data['links'][1]['href'] == 'http://localhost/pizzas/1'
    assert data['links'][2]['href'] == 'http://localhost/pizzas/1'

@patch('database.DynamoDBClient.update_item')
def test_patch_pizza(mock_update_item, client):
    test_pizza = {
        "id": 1,
        "name": "Updated Pizza",
        "created_at": "2021-01-01T00:00:00Z",
        "updated_at": "2021-01-01T00:00:00Z"
    }
    mock_update_item.return_value = test_pizza
    response = client.patch('/pizzas/1', json=test_pizza)
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['id'] == 1
    assert data['name'] == "Updated Pizza"
    assert data['links'][0]['href'] == 'http://localhost/pizzas/1'
    assert data['links'][1]['href'] == 'http://localhost/pizzas/1'
    assert data['links'][2]['href'] == 'http://localhost/pizzas/1'

@patch('database.DynamoDBClient.delete_item')
def test_delete_pizza(mock_delete_item, client):
    mock_delete_item.return_value = None
    response = client.delete('/pizzas/1')
    assert response.status_code == 204

@patch('database.DynamoDBClient.get_all_items')
def test_get_toppings(mock_get_all_items, client):
    mock_get_all_items.return_value = [
        {
            "id": 1,
            "name": "Sample Topping 1"
        },
        {
            "id": 2,
            "name": "Sample Topping 2"
        }
    ]

    response = client.get('/toppings')
    data = json.loads(response.data)
    assert response.status_code == 200, f"Failed with {response.status_code}, message: {response.data}"
    assert len(data) == 2, "Should return 2 toppings"
    assert data[0]['name'] == "Sample Topping 1", "First topping name does not match"
    assert data[1]['name'] == "Sample Topping 2", "Second topping name does not match"
    assert data[0]['links'][0]['href'] == 'http://localhost/toppings/1', 'First topping self link incorrect'
    assert data[0]['links'][1]['href'] == 'http://localhost/toppings/1', 'First topping update link incorrect'
    assert data[0]['links'][2]['href'] == 'http://localhost/toppings/1', 'First topping delete link incorrect'

@patch('database.DynamoDBClient.create_item')
def test_post_toppings(mock_create_item, client):
    mock_create_item.return_value = None

    test_topping = {
        "id": 1,
        "name": "Test Topping"
    }
    response = client.post('/toppings', json=test_topping)
    data = json.loads(response.data)
    assert response.status_code == 201, f"Failed with {response.status_code}, message: {response.data}"
    assert data['id'] == test_topping['id'], "Returned topping ID does not match"
    assert data['name'] == test_topping['name'], "Returned topping name does not match"
    assert data['links'][0]['href'] == 'http://localhost/toppings/1', 'Returned topping self link incorrect'
    assert data['links'][1]['href'] == 'http://localhost/toppings/1', 'Returned topping update link incorrect'
    assert data['links'][2]['href'] == 'http://localhost/toppings/1', 'Returned topping delete link incorrect'


# Mock the 'get_item' function to return a sample topping
@patch('database.DynamoDBClient.get_item')
def test_get_topping(mock_get_item, client):
    mock_get_item.return_value = {
        "id": 2,
        "name": "Sample Topping 2"
    }
    response = client.get('/toppings/2')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['id'] == 2
    assert data['name'] == "Sample Topping 2"
    assert data['links'][0]['href'] == 'http://localhost/toppings/2'
    assert data['links'][1]['href'] == 'http://localhost/toppings/2'
    assert data['links'][2]['href'] == 'http://localhost/toppings/2'

@patch('database.DynamoDBClient.update_item')
@patch('database.DynamoDBClient.get_item', return_value={})
def test_patch_topping_not_found(mock_get_item, mock_update_item, client):
    mock_update_item.return_value = None
    test_topping = {
        "name": "Sample Topping 3"
    }
    response = client.patch('/toppings/2', json=test_topping)
    data = json.loads(response.data)
    assert response.status_code == 404
    assert 'error' in data

@patch('database.DynamoDBClient.update_item')
@patch('database.DynamoDBClient.get_item')
def test_patch_topping(mock_get_item, mock_update_item, client):
    test_topping = {
        "id": 2,
        "name": "Sample Topping 2"
    }
    mock_get_item.return_value = test_topping
    mock_update_item.return_value = {
        "id": 2,
        "name": "Updated Topping"
    }
    response = client.patch('/toppings/2', json={"name": "Updated Topping"})
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['id'] == 2
    assert data['name'] == "Updated Topping"
    assert data['links'][0]['href'] == 'http://localhost/toppings/2'
    assert data['links'][1]['href'] == 'http://localhost/toppings/2'
    assert data['links'][2]['href'] == 'http://localhost/toppings/2'

@patch('database.DynamoDBClient.delete_item')
def test_delete_topping(mock_delete_item, client):
    mock_delete_item.return_value = None
    response = client.delete('/toppings/1')
    assert response.status_code == 204

# Mocking 'get_all_items' function to return a list of sample pizza toppings
@patch('database.DynamoDBClient.get_all_items')
def test_get_pizza_toppings(mock_get_all_items, client):
    mock_get_all_items.return_value = [
        {
            "pizza_id": 1,
            "topping_id": 1
        },
        {
            "pizza_id": 1,
            "topping_id": 2
        }
    ]

    response = client.get('/pizza_toppings')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]['pizza_id'] == 1
    assert data[0]['topping_id'] == 1
    assert data[1]['pizza_id'] == 1
    assert data[1]['topping_id'] == 2

# Mocking 'create_item' method to do nothing as we do not check whether it has any side effects for this POST case
@patch('database.DynamoDBClient.create_item')
def test_post_pizza_topping(mock_create_item, client):
    mock_create_item.return_value = None

    test_pizza_topping = {
        "pizza_id": 1,
        "topping_id": 1
    }
    response = client.post('/pizza_toppings', json=test_pizza_topping)
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data['pizza_id'] == test_pizza_topping['pizza_id']
    assert data['topping_id'] == test_pizza_topping['topping_id']

# Mock 'get_item' function to return a sample pizza topping
@patch('database.DynamoDBClient.get_item')
def test_get_pizza_topping(mock_get_item, client):
    mock_get_item.return_value = {
        "id": 1,
        "pizza_id": 1,
        "topping_id": 1
    }
    response = client.get('/pizza_toppings/1')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['id'] == 1
    assert data['pizza_id'] == 1
    assert data['topping_id'] == 1

# Mock 'get_item' to return None
@patch('database.DynamoDBClient.get_item', return_value={})
def test_get_pizza_topping_not_found(mock_get_item, client):
    response = client.get('/pizza_toppings/1')
    data = json.loads(response.data)
    assert response.status_code == 404
    assert 'error' in data
    assert data['error'] == 'Pizza topping not found'

# Mock 'delete_item' method to do nothing as we do not check whether it has any side effects for this DELETE case
@patch('database.DynamoDBClient.delete_item')
def test_delete_pizza_topping(mock_delete_item, client):
    mock_delete_item.return_value = None
    response = client.delete('/pizza_toppings/1')
    assert response.status_code == 204

import json

# Mock the 'query_table' and 'batch_get_item' functions to return topping information
@patch('database.DynamoDBClient.query_table')
@patch('database.DynamoDBClient.batch_get_item')
def test_get_pizza_toppings(mock_batch_get_item, mock_query_table, client):
    mock_query_table.return_value = [
        {
            "pizza_id": 1,
            "topping_id": 1
        },
        {
            "pizza_id": 1,
            "topping_id": 2
        }
    ]
    mock_batch_get_item.return_value = [
        {
            "id": 1,
            "name": "Mushrooms"
        },
        {
            "id": 2,
            "name": "Olives"
        }
    ]
    
    response = client.get('/pizzas/1/toppings')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['pizza_id'] == 1
    assert data['toppings'][0]['pizza_id'] == 1
    assert data['toppings'][1]['pizza_id'] == 1
    assert data['topping_records'][0]['name'] == "Mushrooms"
    assert data['topping_records'][1]['name'] == "Olives"

# Mock the 'query_table' function to return None
@patch('database.DynamoDBClient.query_table', return_value=None)
def test_get_pizza_toppings_pizza_not_found(mock_query_table, client):
    response = client.get('/pizzas/1/toppings')
    data = json.loads(response.data)
    assert response.status_code == 404
    assert 'error' in data
    assert data['error'] == 'Pizza not found'
