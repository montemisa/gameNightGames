import json
import boto3
from boto3.dynamodb.conditions import Key
import os

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('ChameleonGames')
sessionsTable = dynamodb.Table('Sessions')
sqs = boto3.client('sqs')
queueUrl = os.environ['queue_url']
        
def lambda_handler(event, context):
    print(event)
    print(context)
    evt = json.loads(event['body'])
        
    if 'sessionId' not in evt:
        return {
            'statusCode': 400,
            'body': 'No sessionId provided',
        }
        
    if 'displayName' not in evt:
         return {
            'statusCode': 400,
            'body': 'No displayName provided',
        }
        
    if 'pathParameters' not in event or 'gameId' not in event['pathParameters']:
         return {
            'statusCode': 400,
            'body': 'No gameId provided',
        }
        
    sessionId = evt['sessionId']
    displayName = evt['displayName']
    gameId = event['pathParameters']['gameId']
    
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
            
    resp = table.query(
        IndexName="CustomGameIdIndex",
        KeyConditionExpression=Key('customGameId').eq(gameId),
        Limit=1,
    )

    if resp['Count'] == 0:
        gameIdToFetch = gameId
    else:
        gameIdToFetch = resp['Items'][0]['gameId']
    
    resp = table.get_item(Key={"gameId": gameIdToFetch})
    
    if 'Item' not in resp:
        return {
            'statusCode': 400,
            'body': 'Game not found',
        }
    
    game = resp['Item']

    player_found = False
    for cp in game['connectedPlayers']:
        if cp['sessionId'] == sessionId:
            player_found = True
            cp['displayName'] = displayName

    if not player_found:
        game['connectedPlayers'].append(
            {
                'sessionId': sessionId,
                'displayName': displayName,
                'isHost': False
            }
        )
    
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
