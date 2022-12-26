import aws_cdk as cdk
from constructs import Construct
from aws_cdk import (aws_dynamodb as dynamodb)

class DynamoService(Construct):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        self.sessions_table = dynamodb.CfnTable(
            self, 
            "UserSessions",
            table_name="Sessions",
            key_schema=[dynamodb.CfnTable.KeySchemaProperty(
                attribute_name="sessionId",
                key_type="HASH"
            )],
            attribute_definitions=[dynamodb.CfnTable.AttributeDefinitionProperty(
                attribute_name="sessionId",
                attribute_type="S"
            )],
            billing_mode="PAY_PER_REQUEST"
        )


        self.games_table = dynamodb.CfnTable(
            self,
            "ChameleonGames",
            table_name="ChameleonGames",
            key_schema=[dynamodb.CfnTable.KeySchemaProperty(
                attribute_name="gameId",
                key_type="HASH"
            )],
            attribute_definitions=[
                dynamodb.CfnTable.AttributeDefinitionProperty(
                    attribute_name="gameId",
                    attribute_type="S"
                ),
                dynamodb.CfnTable.AttributeDefinitionProperty(
                    attribute_name="customGameId",
                    attribute_type="S"
                )
            ],
            global_secondary_indexes=[dynamodb.CfnTable.GlobalSecondaryIndexProperty(
                index_name="CustomGameIdIndex",
                key_schema=[dynamodb.CfnTable.KeySchemaProperty(
                    attribute_name="customGameId",
                    key_type="HASH"
                )],
                projection=dynamodb.CfnTable.ProjectionProperty(
                    projection_type="KEYS_ONLY"
                ),
            )],
            billing_mode="PAY_PER_REQUEST"
        )

