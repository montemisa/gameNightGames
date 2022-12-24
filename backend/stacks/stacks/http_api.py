import aws_cdk as cdk
from constructs import Construct
from aws_cdk import (aws_lambda as lambda_,
                     aws_iam as iam,
                     aws_sqs as sqs,
                     aws_lambda_event_sources as lambda_event_sources
                    )
from aws_cdk.aws_apigatewayv2_integrations_alpha import HttpLambdaIntegration
from aws_cdk.aws_apigatewayv2_alpha import (HttpApi, CorsPreflightOptions, CorsHttpMethod, HttpMethod, WebSocketStage)


class HttpApiService(Construct):
    def __init__(self, scope: Construct, id: str, websocketStage: WebSocketStage):
        super().__init__(scope, id)

        http_api = HttpApi(
            self,
            "GameNightsHttpApi",
            api_name="GameNightsHttpApi",
            cors_preflight=CorsPreflightOptions(
                allow_credentials=False,
                allow_headers=["*"],
                allow_methods=[CorsHttpMethod.POST, CorsHttpMethod.GET, CorsHttpMethod.PUT],
                allow_origins=["*"],
                expose_headers=["*"]
            ),
            description="The HTTP endpoints for our service",
        )

        game_update_queue = sqs.Queue(self, "GamesUpdates")
        sqs_event_source = lambda_event_sources.SqsEventSource(game_update_queue)

        dynamo_policy = iam.PolicyStatement( # Restrict to listing and describing tables
            actions=["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Query"],
            resources=["*"]
        )

        create_session_handler = lambda_.Function(
            self,
            "CreateSessionHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="create_session.lambda_handler",
            initial_policy=[dynamo_policy],
        )
        create_session_integration = HttpLambdaIntegration(
            "CreateSessionIntegration",
            handler=create_session_handler
        )

        validate_session_handler = lambda_.Function(
            self,
            "ValidateSessionHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="validate_session.lambda_handler",
            initial_policy=[iam.PolicyStatement(
                actions=["dynamodb:GetItem"],
                resources=["*"]
            )]
        )

        validate_session_integration = HttpLambdaIntegration(
            "ValidateSessionIntegration",
            handler=validate_session_handler
        )

        create_game_handler = lambda_.Function(
            self,
            "CreateGameHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="create_game.lambda_handler",
            initial_policy=[dynamo_policy]
        )

        create_game_integration = HttpLambdaIntegration(
            "CreateGameIntegration",
            handler=create_game_handler
        )

        join_game_handler = lambda_.Function(
            self,
            "JoinGameHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="join_game.lambda_handler",
            initial_policy=[dynamo_policy],
            environment={"queue_url": game_update_queue.queue_url}
        )

        join_game_integration = HttpLambdaIntegration(
            "JoinGameIntegration",
            handler=join_game_handler
        )

        start_game_handler = lambda_.Function(
            self,
            "StartGameHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="start_game.lambda_handler",
            initial_policy=[dynamo_policy],
            environment={"queue_url": game_update_queue.queue_url}
        )

        start_game_integration = HttpLambdaIntegration(
            "StartGameIntegration",
            handler=start_game_handler
        )

        game_update_handler = lambda_.Function(
            self,
            "GameUpdateHandler",
            runtime=lambda_.Runtime.PYTHON_3_9,
            code=lambda_.Code.from_asset("resources"),
            handler="broadcast_game_update.lambda_handler",
            initial_policy=[dynamo_policy],
            environment={"websocket_url": websocketStage.callback_url}
        )

        game_update_handler.add_event_source(sqs_event_source)
        game_update_queue.grant_consume_messages(game_update_handler)
        websocketStage.grant_management_api_access(game_update_handler)

        http_api.add_routes(
            path="/session/validate",
            methods=[HttpMethod.POST],
            integration=validate_session_integration
        )

        http_api.add_routes(
            path="/session",
            methods=[HttpMethod.POST],
            integration=create_session_integration
        )

        http_api.add_routes(
            path="/chameleon",
            methods=[HttpMethod.POST],
            integration=create_game_integration
        )

        http_api.add_routes(
            path="/chameleon/{gameId}",
            methods=[HttpMethod.PUT],
            integration=join_game_integration
        )

        http_api.add_routes(
            path="/chameleon/{gameId}/start",
            methods=[HttpMethod.PUT],
            integration=start_game_integration
        )

        game_update_queue.grant_send_messages(join_game_handler)
        game_update_queue.grant_send_messages(start_game_handler)
