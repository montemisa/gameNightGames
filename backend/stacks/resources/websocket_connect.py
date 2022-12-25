import json
import boto3
from datetime import datetime
import os

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('Sessions')
gameTable = dynamodb.Table("ChameleonGames")
client = boto3.client('apigatewaymanagementapi', endpoint_url=os.environ['websocket_url'])

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
        
    queryParams = event['queryStringParameters']

    sessionId = queryParams['sessionId']

    resp = table.get_item(Key={"sessionId": sessionId})
    if 'Item' not in resp:
        return {
            'statusCode': 400,
            'body': 'SessionId does not exist'
        }

    user = resp['Item']
    user['websocketId'] = connectionId
    table.put_item(Item=user)

    game = {}

    if "gameId" in queryParams and len(queryParams["gameId"]) > 1:
        gameId = queryParams["gameId"]
        resp = gameTable.get_item(Key={"gameId": gameId})
        if 'Item' in resp:
            game = resp['Item']
            game.pop('createdAt', None)
            try:
                client.post_to_connection(ConnectionId=connectionId, Data=json.dumps(game).encode('utf-8'))
            except:
                print("Error writing to {0} in connect call".format(connectionId))
        else:
            print("Could not find game with gameId: ", gameId)

        
    return {
        'statusCode': 200,
    }