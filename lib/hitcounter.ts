import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface HitCounterProps {
	/** the function for which we want to count url hits **/
	downstream: IFunction;
}

export class HitCounter extends Construct {
	/** allows accessing the counter function */
	public readonly handler: Function;

	/** allows accessing the hit counter table */
	public readonly table: Table;

	constructor(scope: Construct, id: string, props: HitCounterProps) {
		super(scope, id);

		this.table = new Table(this, 'Hits', {
			partitionKey: { name: 'path', type: AttributeType.STRING },
			removalPolicy: RemovalPolicy.DESTROY,
		});

		this.handler = new Function(this, 'HitCounterHandler', {
			runtime: Runtime.NODEJS_20_X,
			handler: 'hitcounter.handler',
			code: Code.fromAsset('lambda'),
			environment: {
				DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
				HITS_TABLE_NAME: this.table.tableName,
			},
		});

		this.table.grantReadWriteData(this.handler);
		props.downstream.grantInvoke(this.handler);
	}
}
