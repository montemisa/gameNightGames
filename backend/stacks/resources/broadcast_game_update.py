import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
sessionsTable = dynamodb.Table('Sessions')

client = boto3.client('apigatewaymanagementapi', endpoint_url=os.environ['websocket_url'])

table = dynamodb.Table('Games')

def lambda_handler(event, context):
    print(event)
    print(context)

    for record in event["Records"]:
        body = json.loads(record["body"])
        
        
        if 'game' not in body:
            print("No game provided: ", record)
   
        
        game = body['game']

        connectedPlayers = [
            {
                'displayName': cp.get('displayName'),
                'isHost': cp.get('isHost', False)
            } for cp in game.get('connectedPlayers', [])
        ]
        gameState = {
            'gameId': game['gameId'],
            'gameStatus': game.get('gameStatus', "UNKNOWN"),
            'connectedPlayers': connectedPlayers
        }
        
        for cp in game['connectedPlayers']:
            resp = sessionsTable.get_item(Key={"sessionId": cp['sessionId']})

            if 'Item' in resp and 'websocketId' in resp['Item']:
                print('Could not find {0} or no websocket', cp['sessionId'])
            
            websocketId = resp['Item']['websocketId']
            try:
                if body["message_type"] == "JOIN_GAME":
                    gameState['messageType'] = 2
                    msg = gameState
                elif body["message_type"] == "START_GAME":
                    msg = {
                        'word': cp['word'],
                        'messageType': 1,
                    }
                print("Writing to {0}: {1}".format(websocketId, msg))
                client.post_to_connection(ConnectionId=websocketId, Data=json.dumps(msg).encode('utf-8'))
            except:
                print("Error writing to {0} for player: {1}".format(cp.get('websocketId'), cp.get('displayName')))

    return {
        'statusCode': 200,
    }