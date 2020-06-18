import 'dotenv/config';

import cors from 'cors';
import logger from 'morgan';

import { Response, NextFunction } from 'express';
import { GraphQLServer, PubSub } from 'graphql-yoga';

import { genSchema } from './utils/genSchema';
import typeormdbc from './ormconnection';
import decodeJWT from './utils/token/decodeJWT';

/*<----------------------------class App-------------------------------->*/

class App {
	public app: GraphQLServer;
	private pubSub: any;
	private schema: any;
	constructor() {
		this.schema = genSchema();
		this.pubSub = new PubSub();
		this.pubSub.ee.setMaxListeners(99);
		this.app = new GraphQLServer({
			schema: this.schema,
			context: (req) => {
				//localPassAuth(); 패스포트 잠정 중단
				const { connection: { context = null } = {} } = req;
				return {
					req: req.request,
					pubSub: this.pubSub, //데이터 쌍방향 통신 (publish-Subscribe)
					context,
				};
			},
		});
		typeormdbc();
		this.middlewares();
	}
	private middlewares = (): void => {
		this.app.express.use(this.jwt);
		this.app.express.use(cors());
		this.app.express.use(logger('dev'));
	};
	private jwt = async (req, res: Response, next: NextFunction): Promise<void> => {
		const token = req.get('X-JWT'); //access token
		if (token) {
			const user = await decodeJWT(token); // 토큰이 있을 경우 token을 풀어 유저 정보를 자겨온다.
			if (user) {
				req.user = user;
			} else {
				req.user = undefined;
			}
		}
		next();
	};
}

export default new App().app;
