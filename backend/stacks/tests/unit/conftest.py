import os
import boto3
from moto import mock_dynamodb
import pytest
from unittest import mock
import datetime

os.environ['AWS_DEFAULT_REGION'] = 'us-west-2'
os.environ['SESSIONS_TABLE_NAME'] = 'Sessions'

@pytest.fixture
def mocking_datetime_now(monkeypatch):
    datetime_mock = mock.MagicMock(wrap=datetime.datetime)
    datetime_mock.now.return_value = datetime.datetime(2020, 3, 11, 0, 0, 0)
    datetime_mock.fromtimestamp.return_value = datetime.datetime.now()
    datetime_mock.side_effect = lambda *args, **kw: datetime.datetime(*args, **kw)
    monkeypatch.setattr(datetime, "datetime", datetime_mock)

@pytest.fixture(scope='module')
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
    os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
    os.environ['AWS_SECURITY_TOKEN'] = 'testing'
    os.environ['AWS_SESSION_TOKEN'] = 'testing'

@pytest.fixture(scope='module')
def sessions_table():
    with mock_dynamodb():
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.create_table(
            TableName='Sessions',
            KeySchema=[{'AttributeName': 'sessionId', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'sessionId','AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        )
        table.meta.client.get_waiter('table_exists').wait(TableName='Sessions')
        yield table