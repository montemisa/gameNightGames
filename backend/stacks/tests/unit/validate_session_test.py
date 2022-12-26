import boto3
import pytest
from moto import mock_dynamodb
import time
from resources.validate_session import *
from unittest import mock
from datetime import datetime, timedelta
    
class TestValidateSession:

    MOCK_DATETIME_NOW = datetime(2022, 1, 1, 0, 0, 0)

    def test_session_does_not_exist(self, sessions_table):
        body = {'sessionId': 'non-existent-id'}
        response = lambda_handler(event={'body': json.dumps(body)}, context={}, sessions_table=sessions_table)

        assert(response["statusCode"] == 400)
        assert(response['body'] == 'Invalid')


    @mock.patch('resources.validate_session.datetime', mock.MagicMock(now=mock.Mock(return_value=MOCK_DATETIME_NOW), fromtimestamp=mock.Mock(wraps=datetime.fromtimestamp)))
    def test_session_expired(self, sessions_table):
        sessionId = 'mock-session-id'
        createdAt = self.MOCK_DATETIME_NOW - timedelta(seconds=MAX_SESSION_TIME + 1)

        session = {
            'sessionId': sessionId,
            'createdAt': int(round(createdAt.timestamp()))
        }

        sessions_table.put_item(Item=session)
        body = {'sessionId': sessionId}
        response = lambda_handler(event={'body': json.dumps(body)}, context={}, sessions_table=sessions_table)
        
        assert(response["statusCode"] == 400)
        assert(response['body'] == 'Invalid')

    @mock.patch('resources.validate_session.datetime', mock.MagicMock(now=mock.Mock(return_value=MOCK_DATETIME_NOW), fromtimestamp=mock.Mock(wraps=datetime.fromtimestamp)))
    def test_session_valid(self, sessions_table):
        sessionId = 'mock-session-id'
        createdAt = self.MOCK_DATETIME_NOW - timedelta(seconds=MAX_SESSION_TIME - 1)

        session = {
            'sessionId': sessionId,
            'createdAt': int(round(createdAt.timestamp()))
        }

        sessions_table.put_item(Item=session)
        body = {'sessionId': sessionId}
        response = lambda_handler(event={'body': json.dumps(body)}, context={}, sessions_table=sessions_table)
        
        assert(response["statusCode"] == 200)
        