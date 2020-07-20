import 'reflect-metadata';
import { Options } from 'graphql-yoga';
import app from './app';

import 'dotenv/config';
import decodeJWT from './utils/token/decodeJWT';
import depthLimit from 'graphql-depth-limit';

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';
const SUBSCRIPTION_ENDPOINT: string = '/subscription';

const appOptions: Options = {
	port: PORT,
	playground: PLAYGROUND_ENDPOINT,
	endpoint: GRAPHQL_ENDPOINT,
	subscriptions: {
		path: SUBSCRIPTION_ENDPOINT,
		// subscription은 http 통신이 아닌 웹 소켓을 통하기 때문에
		// 별도의 토큰 인증 방식을 또 작성해주어야 한다
		onConnect: async (connectionParams) => {
			const token = connectionParams['X-JWT'];
			if (token) {
				const user = await decodeJWT(token);
				if (user) {
					return {
						currentUser: user,
					};
				}
			}
			throw new Error('JWT 토큰이 필요합니다 로그인해주세요');
		},
	},
	validationRules: [depthLimit(12)],
};

app.start(appOptions, () => {
	console.log(`🚀 Server is running on localhost:${PORT}`);
	console.log(`🚀 Subscriptions ready at ${SUBSCRIPTION_ENDPOINT}`);
});
