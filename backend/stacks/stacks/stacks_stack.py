from aws_cdk import (
    # Duration,
    Stack,
    # aws_sqs as sqs,
)
from constructs import Construct
from . import dynamo_tables
from . import http_api
from . import websocket_api


class StacksStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        dynamo_service = dynamo_tables.DynamoService(self, "DynamoTables")
        websocket_service = websocket_api.WebSocketApiService(self, "WebSocketApi")

        http_api.HttpApiService(self, "HttpApi", websocket_service.websocket_stage, dynamo_service)

        # The code that defines your stack goes here

        # example resource
        # queue = sqs.Queue(
        #     self, "StacksQueue",
        #     visibility_timeout=Duration.seconds(300),
        # )
