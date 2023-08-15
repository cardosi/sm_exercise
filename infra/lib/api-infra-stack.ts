import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');


export class APIInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `API-${id}`, {
      restApiName: 'FlaskApi'
    })

    const pyFunc = new PythonFunction(this, `Flask-App-${id}`, {
      entry: path.join(__dirname, '..', '..', 'api'),
      runtime: Runtime.PYTHON_3_8,
      index: 'app.py',
      environment: {
        "ENV": "PROD"
      },
      timeout: cdk.Duration.seconds(10)
    })

    const integration = new LambdaIntegration(pyFunc)

    const toppingsTable = new Table(this, `Toppings-Table-${id}`, {
      tableName: 'Toppings',
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
    });

    const pizzasTable = new Table(this, `Pizzas-Table-${id}`, {
      tableName: 'Pizzas',
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
    });

    const pizzaToppingsTable = new Table(this, `Pizza-Toppings-Table-${id}`, {
      tableName: 'PizzaToppings',
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
    });

    toppingsTable.grantReadWriteData(pyFunc)
    pizzasTable.grantReadWriteData(pyFunc)
    pizzaToppingsTable.grantReadWriteData(pyFunc)

    api.root.addMethod('ANY', integration)

    // '/pizzas'
    const pizzasResource = api.root.addResource('pizzas')
    pizzasResource.addMethod('OPTIONS', integration)
    pizzasResource.addMethod('GET', integration)
    pizzasResource.addMethod('POST', integration)

    // '/pizzas/{id}'
    const pizzaResource = pizzasResource.addResource('{id}')
    pizzaResource.addMethod('OPTIONS', integration)
    pizzaResource.addMethod('GET', integration)
    pizzaResource.addMethod('PUT', integration)
    pizzaResource.addMethod('DELETE', integration)

    // '/toppings'
    const toppingsResource = api.root.addResource('toppings')
    toppingsResource.addMethod('OPTIONS', integration)
    toppingsResource.addMethod('GET', integration)
    toppingsResource.addMethod('POST', integration)
    
    // '/toppings/{id}'
    const toppingResource = toppingsResource.addResource('{id}')
    toppingResource.addMethod('OPTIONS', integration)
    toppingResource.addMethod('GET', integration)
    toppingResource.addMethod('PUT', integration)
    toppingResource.addMethod('DELETE', integration)
    
    // '/pizza_toppings'
    const pizzaToppingsResource = api.root.addResource('pizza_toppings')
    pizzaToppingsResource.addMethod('OPTIONS', integration)
    pizzaToppingsResource.addMethod('GET', integration)
    pizzaToppingsResource.addMethod('POST', integration)

    // '/pizza_toppings/{id}'
    const pizzaToppingResource = pizzaToppingsResource.addResource('{id}')
    pizzaToppingResource.addMethod('OPTIONS', integration)
    pizzaToppingResource.addMethod('DELETE', integration)
  }
}
