import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('Sessions')

def lambda_handler(event, context):
    # TODO implement
    print(event)
    print(context)
    sessionId = None
    connectionId = event['requestContext']['connectionId']
    if 'queryStringParameters' not in event or 'sessionId' not in event['queryStringParameters']:
        return {
            'statusCode': 400,
            'body': 'No sessionId provided'
        }
        
        
    sessionId = event['queryStringParameters']['sessionId']

    resp = table.get_item(Key={"sessionId": sessionId})
    if 'Item' not in resp:
        return {
            'statusCode': 400,
            'body': 'SessionId does not exist'
        }

    user = resp['Item']
    user['websocketId'] = connectionId
    table.put_item(Item=user)
        
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }