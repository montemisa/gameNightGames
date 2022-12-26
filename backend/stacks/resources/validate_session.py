import json
import boto3
import os
from datetime import datetime

MAX_SESSION_TIME = 60 * 60 * 8

def checkValid(session):
    ts = int(session['createdAt'])
    createdAt = datetime.fromtimestamp(ts)
    now = datetime.now()

    diff = now - createdAt
    return diff.total_seconds() < MAX_SESSION_TIME

def get_table():
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(os.environ["SESSIONS_TABLE_NAME"])
    return table

default_table = get_table()

def lambda_handler(event, context, sessions_table=default_table):
    print(event)
    if 'body' not in event or 'sessionId' not in json.loads(event['body']):
        return {
            'statusCode': 400,
            'body': 'No sessionId provided',
        }
    sessionId = json.loads(event['body'])['sessionId']
    resp = sessions_table.get_item(Key={"sessionId": sessionId})
    
    if 'Item' not in resp or not checkValid(resp['Item']):
        return {
            'statusCode': 400,
            'body': 'Invalid'
        }
        
    return {
        'statusCode': 200,
        'body': json.dumps({
            'sessionId': resp['Item']['sessionId'],
        })
    }
