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
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const pizzasTable = new Table(this, `Pizzas-Table-${id}`, {
      tableName: 'Pizzas',
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const pizzaToppingsTable = new Table(this, `Pizza-Toppings-Table-${id}`, {
      tableName: 'PizzaToppings',
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    toppingsTable.grantReadWriteData(pyFunc)
    pizzasTable.grantReadWriteData(pyFunc)
    pizzaToppingsTable.grantReadWriteData(pyFunc)

    api.root.addMethod('ANY', integration)
    const testResource = api.root.addResource('test')
    testResource.addMethod('GET', integration)
    testResource.addMethod('POST', integration)
  }
}
