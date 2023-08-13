import awsgi
from flask import Flask, jsonify, request, url_for
from database import DynamoDBClient

app = Flask(__name__)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,PUT,POST,DELETE,OPTIONS')
    return response


routes = {
    'get_pizzas': '/pizzas',
    'create_pizza': '/pizzas',
    'get_pizza': '/pizzas/{id}',
    'update_pizza': '/pizzas/{id}',
    'delete_pizza': '/pizzas/{id}',
    'get_toppings': '/toppings',
    'create_topping': '/toppings',
    'get_topping': '/toppings/{id}',
    'update_topping': '/toppings/{id}',
    'delete_topping': '/toppings/{id}',
    'create_pizza_topping': '/pizza_toppings',
    'get_pizza_topping': '/pizza_toppings/{id}',
    'delete_pizza_topping': '/pizza_toppings/{id}'
}


@app.route('/')
def root():
    return jsonify({
        'message': 'Welcome to the Pizza API',
        'routes': {
            'get_pizzas': '/pizzas',
            'create_pizza': '/pizzas',
            'get_pizza': '/pizzas/{id}',
            'update_pizza': '/pizzas/{id}',
            'delete_pizza': '/pizzas/{id}',
            'get_toppings': '/toppings',
            'create_topping': '/toppings',
            'get_topping': '/toppings/{id}',
            'update_topping': '/toppings/{id}',
            'delete_topping': '/toppings/{id}',
            'create_pizza_topping': '/pizza_toppings',
            'get_pizza_topping': '/pizza_toppings/{id}',
        }
    })


@app.route('/pizzas', methods=['GET', 'POST'])
def manage_pizzas():
    ddb = DynamoDBClient('Pizzas')
    if request.method == 'GET':
        try:
            items = ddb.get_all_items()
            for item in items:
                item['links'] = [
                    {'rel': 'self', 'href': url_for(
                        'manage_pizza', id=item['id'], _external=True)},
                    {'rel': 'update', 'href': url_for(
                        'manage_pizza', id=item['id'], _external=True)},
                    {'rel': 'delete', 'href': url_for(
                        'manage_pizza', id=item['id'], _external=True)}
                ]
            return jsonify(items), 200
        except Exception as e:
            return str(e), 500

    if request.method == 'POST':
        try:
            item = request.get_json()
            ddb.create_item(item)
            item['links'] = [
                {'rel': 'self', 'href': url_for(
                    'manage_pizza', id=item['id'], _external=True)},
                {'rel': 'update', 'href': url_for(
                    'manage_pizza', id=item['id'], _external=True)},
                {'rel': 'delete', 'href': url_for(
                    'manage_pizza', id=item['id'], _external=True)}
            ]
            return jsonify(item), 201
        except Exception as e:
            return str(e), 500


@app.route('/pizzas/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def manage_pizza(id):
    ddb = DynamoDBClient('Pizzas')
    ddb_pizza_toppings = DynamoDBClient('PizzaToppings')
    if request.method == 'GET':
        try:
            item = ddb.get_item(id)
            if item:
                item['links'] = [
                    {'rel': 'self', 'href': url_for(
                        'manage_pizza', id=id, _external=True)},
                    {'rel': 'update', 'href': url_for(
                        'manage_pizza', id=id, _external=True)},
                    {'rel': 'delete', 'href': url_for(
                        'manage_pizza', id=id, _external=True)}
                ]
                return jsonify(item), 200
            else:
                return jsonify({'error': 'Pizza not found'}), 404
        except Exception as e:
            return str(e), 500

    if request.method == 'PUT':
        try:
            pizza_updates = request.get_json()
            pizza = ddb.get_item({"id": id})
            if pizza:
                for key, value in pizza_updates.items():
                    pizza[key] = value
                ddb.update_item(pizza)
                pizza['links'] = [
                    {'rel': 'self', 'href': url_for(
                        'manage_pizza', id=id, _external=True)},
                    {'rel': 'update', 'href': url_for(
                        'manage_pizza', id=id, _external=True)},
                    {'rel': 'delete', 'href': url_for(
                        'manage_pizza', id=id, _external=True)}
                ]
            return jsonify(pizza), 200
        except Exception as e:
            return str(e), 500

    if request.method == 'DELETE':
        try:
            ddb.delete_item({"id": id})
            body = request.get_json()
            ddb_pizza_toppings.batch_delete_items(body['pizza_topping_ids'])
            return '', 204
        except Exception as e:
            return str(e), 500


@app.route('/toppings', methods=['GET', 'POST'])
def manage_toppings():
    ddb = DynamoDBClient('Toppings')
    if request.method == 'GET':
        try:
            toppings = ddb.get_all_items()
            for topping in toppings:
                topping['links'] = [
                    {'rel': 'self', 'href': url_for(
                        'manage_topping', id=topping['id'], _external=True)},
                    {'rel': 'update', 'href': url_for(
                        'manage_topping', id=topping['id'], _external=True)},
                    {'rel': 'delete', 'href': url_for(
                        'manage_topping', id=topping['id'], _external=True)}
                ]
            return jsonify(toppings), 200
        except Exception as e:
            return str(e), 500

    if request.method == 'POST':
        try:
            topping = request.get_json()
            ddb.create_item(topping)
            topping['links'] = [
                {'rel': 'self', 'href': url_for(
                    'manage_topping', id=topping['id'], _external=True)},
                {'rel': 'update', 'href': url_for(
                    'manage_topping', id=topping['id'], _external=True)},
                {'rel': 'delete', 'href': url_for(
                    'manage_topping', id=topping['id'], _external=True)}
            ]
            return jsonify(topping), 201
        except Exception as e:
            return str(e), 500


@app.route('/toppings/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def manage_topping(id):
    ddb = DynamoDBClient('Toppings')
    ddb_pizza_toppings = DynamoDBClient('PizzaToppings')
    if request.method == 'GET':
        try:
            topping = ddb.get_item({"id": id})
            if topping:
                topping['links'] = [
                    {'rel': 'self', 'href': url_for(
                        'manage_topping', id=id, _external=True)},
                    {'rel': 'update', 'href': url_for(
                        'manage_topping', id=id, _external=True)},
                    {'rel': 'delete', 'href': url_for(
                        'manage_topping', id=id, _external=True)}
                ]
                return jsonify(topping), 200
            else:
                return jsonify({'error': 'Topping not found'}), 404
        except Exception as e:
            return str(e), 500

    if request.method == 'PUT':
        try:
            topping_updates = request.get_json()
            topping = ddb.get_item({"id": id})
            if topping:
                for key, value in topping_updates.items():
                    topping[key] = value
                ddb.update_item(topping)
                topping['links'] = [
                    {'rel': 'self', 'href': url_for(
                        'manage_topping', id=id, _external=True)},
                    {'rel': 'update', 'href': url_for(
                        'manage_topping', id=id, _external=True)},
                    {'rel': 'delete', 'href': url_for(
                        'manage_topping', id=id, _external=True)}
                ]
                return jsonify(topping), 200
            else:
                return jsonify({'error': 'Topping not found'}), 404
        except Exception as e:
            return str(e), 500

    if request.method == 'DELETE':
        try:
            ddb.delete_item({"id": id})
            body = request.get_json()
            ddb_pizza_toppings.batch_delete_items(body['pizza_topping_ids'])
            return '', 204
        except Exception as e:
            print("ERROR: ", e)
            return str(e), 500


@app.route('/pizza_toppings', methods=['GET', 'POST'])
def manage_pizza_toppings():
    ddb = DynamoDBClient('PizzaToppings')
    if request.method == 'GET':
        try:
            pizza_toppings = ddb.get_all_items()
            return jsonify(pizza_toppings), 200
        except Exception as e:
            return str(e), 500

    if request.method == 'POST':
        try:
            pizza_topping = request.get_json()
            ddb.create_item(pizza_topping)
            return jsonify(pizza_topping), 201
        except Exception as e:
            return str(e), 500


@app.route('/pizza_toppings/<int:id>', methods=['GET', 'DELETE'])
def manage_pizza_topping(id):
    ddb = DynamoDBClient('PizzaToppings')
    if request.method == 'GET':
        try:
            pizza_topping = ddb.get_item({"id": id})
            if pizza_topping:
                return jsonify(pizza_topping), 200
            else:
                return jsonify({'error': 'Pizza topping not found'}), 404
        except Exception as e:
            return str(e), 500

    if request.method == 'DELETE':
        try:
            ddb.delete_item({"id": id})
            return '', 204
        except Exception as e:
            return str(e), 500


@app.route('/pizzas/<int:pizza_id>/toppings', methods=['GET'])
def get_pizza_toppings(pizza_id):
    ddb_pizza_toppings = DynamoDBClient('PizzaToppings')
    ddb_toppings = DynamoDBClient('Toppings')
    try:
        pizza_toppings = ddb_pizza_toppings.query_table('pizza_id', pizza_id)
        if pizza_toppings:
            topping_ids = [topping['topping_id'] for topping in pizza_toppings]
            topping_records = ddb_toppings.batch_get_item(topping_ids)
            return jsonify({'pizza_id': pizza_id, 'toppings': pizza_toppings, 'topping_records': topping_records}), 200
        else:
            return jsonify({'error': 'Pizza not found'}), 404
    except Exception as e:
        return str(e), 500


def handler(event, context):
    return awsgi.response(app, event, context)
