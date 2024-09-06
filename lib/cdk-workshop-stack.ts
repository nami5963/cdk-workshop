import { Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class CdkWorkshopStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// Lambda
		const hello = new Function(this, 'HelloHandler', {
			runtime: Runtime.NODEJS_20_X,
			code: Code.fromAsset('lambda'),
			handler: 'hello.handler',
		});

		// API Gateway
		new LambdaRestApi(this, 'Endpoint', {
			handler: hello,
		});
	}
}
