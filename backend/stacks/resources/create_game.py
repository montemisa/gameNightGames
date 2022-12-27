import json
import boto3
import random
import string
import time

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('ChameleonGames')
sessionsTable = dynamodb.Table('Sessions')
        

def lambda_handler(event, context):
    if 'body' not in event: 
        return {
            'statusCode': 400,
            'body': 'No body provided',
        }
        
    request = json.loads(event['body'])
    if 'sessionId' not in request:
        return {
            'statusCode': 400,
            'body': 'No sessionId provided',
        }
        
    if 'displayName' not in request:
         return {
            'statusCode': 400,
            'body': 'No displayName provided',
        }
        
        
    sessionId = request['sessionId']
    displayName = request['displayName']
    
    resp = sessionsTable.get_item(Key={"sessionId": sessionId})
    
    if 'Item' not in resp:
        return {
            'statusCode': 400,
            'body': 'Session not found',
        }
        
    if 'websocketId' not in resp['Item']:
        return {
            'statusCode': 400,
            'body': 'No websocket for sessionId',
        }
        
    websocketId = resp['Item']['websocketId']
    
    if 'customGameId' in request:
        desiredGameId = request['gameId']
        resp = table.get_item(Key={"gameId": desiredGameId})
        if 'Item' in resp:
            return {
                'statusCode': 400,
                'body': 'GameId already in use',
            }
        gameId = desiredGameId
    else:
        gameId = ''.join(random.choices(string.ascii_letters, k=8))
    
    game = {
        "gameId": gameId,
        "hostSessionId": sessionId,
        "connectedPlayers": [
            {
                'sessionId': sessionId,
                'websocketId': websocketId,
                'displayName': displayName,
                'isHost': True
            }
        ],
        "gameStatus": "LOBBY",
        "createdAt": int(round(time.time()))
    }
    
    table.put_item(Item=game)
    
    return {
        'statusCode': 200,
        'body': json.dumps(game)
    }