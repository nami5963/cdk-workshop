export const handler = async function (event) {
	console.log('req: ', JSON.stringify(event, undefined, 2));
	return {
		statusCode: 200,
		headers: { 'Content-Type': 'text/plain' },
		body: 'Hello from Lambda',
	};
};
