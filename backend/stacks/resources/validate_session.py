import json
import boto3
from datetime import datetime

MAX_SESSION_TIME = 60 * 60 * 8
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Sessions')


def checkValid(resp):
    ts = resp['Item']['createdAt']
    createdAt = datetime.fromtimestamp(ts)
    diff = datetime.now() - createdAt
    return diff.total_seconds() < MAX_SESSION_TIME

def lambda_handler(event, context):
    print(event)
    if 'body' not in event or 'sessionId' not in json.loads(event['body']):
        return {
            'statusCode': 400,
            'body': 'No sessionId provided',
        }
    sessionId = json.loads(event['body'])['sessionId']
    
    resp = table.get_item(Key={"sessionId": sessionId})
    
    if 'Item' not in resp or not checkValid(resp):
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
