import json
import boto3
import random
from enum import Enum
import os

class MessageTypes(Enum):
    START_GAME = 1
    PLAYER_JOINED = 2
    ROLE_ASSIGNED = 3
    CHAT_MESSAGE = 4
    GAME_ENDED = 5

MAX_SESSION_TIME = 60 * 60 * 8
dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('ChameleonGames')
sessionsTable = dynamodb.Table('Sessions')
sqs = boto3.client('sqs')
queueUrl = os.environ['queue_url']
        
RANDOM_WORDS = ['House', 'Ocean', 'Religion']

def lambda_handler(event, context):
    print(event)
    print(context)
    evt = json.loads(event['body'])
    
    
    if 'sessionId' not in evt:
        return {
            'statusCode': 400,
            'body': 'No sessionId provided',
        }
        
    if 'pathParameters' not in event or 'gameId' not in event['pathParameters']:
         return {
            'statusCode': 400,
            'body': 'No gameId provided',
        }
        
    sessionId = evt['sessionId']
    gameId = event['pathParameters']['gameId']
    
    
    resp = table.get_item(Key={"gameId": gameId})
    
    if 'Item' not in resp:
        return {
            'statusCode': 400,
            'body': 'Game not found'
        }
    
    game = resp['Item']
    word = evt.get('customWord', random.choice(RANDOM_WORDS))
    
    if game['hostSessionId'] != sessionId:
        return {
            'statusCode': 400,
            'body': 'Only the host can start the game'
        }
    for cp in game['connectedPlayers']:
        cp['word'] = word
        
    cp = random.choice(game['connectedPlayers'])
    cp['word'] = 'Chameleon'
    game['gameStatus'] = 'STARTED'
    game['createdAt'] = 0

    table.put_item(Item=game)

    
    msg = {
        "message_type": "GAME_UPDATE",
        "game": game
    }
    
    sqs.send_message(
        QueueUrl=queueUrl,
        MessageBody=json.dumps(msg)
    )
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

