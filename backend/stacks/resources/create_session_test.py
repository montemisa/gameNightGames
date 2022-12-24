import boto3
import pytest
from moto import mock_dynamodb
from create_session import *


@mock_dynamodb
def test_lambda_handler():

    table_name = 'Sessions'
    dynamodb = boto3.resource('dynamodb', 'us-east-1')

    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{'AttributeName': 'sessionId', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'sessionId','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

    response = lambda_handler(event={}, context={})

    # table = dynamodb.Table(table_name)
    print(response)
    # {'user_id': 'B9B3022F98Fjvjs83AB8a80C185D', 'amount': Decimal('10'), 'updated_at': '2020-08-13T21:44:50.908455'}