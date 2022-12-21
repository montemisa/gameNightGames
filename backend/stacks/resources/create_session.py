import json
import boto3
import secrets
import time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Sessions')

def lambda_handler(event, context):
    
    sessionId = secrets.token_hex(16)
    
    session = {
        "sessionId": sessionId,
        "createdAt": int(round(time.time()))
    }
    
    table.put_item(Item=session)
    
    return {
        'statusCode': 200,
        'body': json.dumps(session)
    }
