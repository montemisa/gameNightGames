import json
import os
import boto3
import secrets
import time

def get_table():
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(os.environ["SESSIONS_TABLE_NAME"])
    return table

default_table = get_table()

def lambda_handler(event, context, sessions_table=default_table):
    sessionId = secrets.token_hex(16)
    
    session = {
        "sessionId": sessionId,
        "createdAt": int(round(time.time()))
    }
    
    sessions_table.put_item(Item=session)
    
    return {
        'statusCode': 200,
        'body': json.dumps(session)
    }
