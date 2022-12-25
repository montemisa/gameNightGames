import aws_cdk as cdk
from constructs import Construct
from aws_cdk import (aws_lambda as lambda_,
                     aws_iam as iam
                    )
from aws_cdk.aws_apigatewayv2_integrations_alpha import WebSocketLambdaIntegration
from aws_cdk.aws_apigatewayv2_alpha import (
    WebSocketApi,
    WebSocketRouteOptions,
    WebSocketStage
)  


class WebSocketApiService(Construct):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        websocket_connect_lambda = lambda_.Function(
            self,
            "WebSocketConnectHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="websocket_connect.lambda_handler",
            initial_policy=[
                iam.PolicyStatement( # Restrict to listing and describing tables
                    actions=["dynamodb:PutItem", "dynamodb:GetItem"],
                    resources=["*"]
                )
            ],
        )
    

        websocket_connect_integration = WebSocketLambdaIntegration(
            "WebSocketConnectIntegration",
            handler=websocket_connect_lambda
        )


        websocket_api = WebSocketApi(
            self,
            "GameNightsWebSocketApi",
            api_name="GameNightsWebSocketApi",
            connect_route_options=WebSocketRouteOptions(
                integration=websocket_connect_integration
            ),
            description="The WebSocket endpoints for our service",
        )

        self.websocket_stage = WebSocketStage(
            self,
            "development",
            web_socket_api=websocket_api,
            stage_name="development",
            auto_deploy=True
        )

        self.websocket_stage.grant_management_api_access(websocket_connect_lambda)
        websocket_connect_lambda.add_environment("websocket_url", self.websocket_stage.callback_url)