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
				const { connection: { context = null } = {} } = req;
				//connection의 default 값은 빈 객체, context의 default값은 null로 정해줘야 컴파일 에러가 안남.
				//(default값 안정해주면 undefined 값은 context의 property로 있을 수 없다면서 자꾸 에러남)
				return {
					req: req.request,
					pubSub: this.pubSub,
					//데이터 쌍방향 통신 (publish-Subscribe)
					connectionContext: context,
					//connection.context 안에 currentUser 라는 이름으로 이전에 저장한 user객체로 접근이 가능해진다.
					//이제 context로 어디서든지 WebSocket 통신을 이용하는 user에게 또한 접근이 가능해진다.
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
		const token = req.get('X-JWT');
		//req.headers에 {'X-JWT':token}하면 req.user의 User_id 접근 가능.
		if (token) {
			const user = await decodeJWT(token);
			// 토큰이 있을 경우 token을 풀어 유저 정보를 가져온다.
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
