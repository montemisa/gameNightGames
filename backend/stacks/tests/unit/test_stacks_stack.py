import aws_cdk as core
import aws_cdk.assertions as assertions

from stacks.stacks_stack import StacksStack

# example tests. To run these tests, uncomment this file along with the example
# resource in stacks/stacks_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = StacksStack(app, "stacks")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
