import boto3
import pytest
from moto import mock_dynamodb
from resources.create_session import *


class TestCreateSession:

    def test_lambda_handler(self, sessions_table):
        print('testing')
        response = lambda_handler(event={}, context={}, sessions_table=sessions_table)

        assert(response["statusCode"] == 200)

        body = json.loads(response['body'])

        fetchResp = sessions_table.get_item(Key={'sessionId': body['sessionId']})

        assert('Item' in fetchResp)
        assert(body['sessionId'] == fetchResp['Item']['sessionId'] )
