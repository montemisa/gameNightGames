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
                'isHost': cp.get('isHost', False),
            } for cp in game.get('connectedPlayers', [])
        ]

        game_state = {
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
                game_state['messageType'] = "GAME_UPDATE"
                game_state['recepientSessionId'] = cp['sessionId']
                game_state['word'] = cp['word'] if 'word' in cp else ''
                print("Writing to {0}: {1}".format(websocketId, game_state))
                client.post_to_connection(ConnectionId=websocketId, Data=json.dumps(game_state).encode('utf-8'))
            except Exception as e:
                print("Error writing to {0} for player: {1}".format(cp.get('websocketId'), cp.get('displayName')))
                print("Exception ", str(e))

    return {
        'statusCode': 200,
    }