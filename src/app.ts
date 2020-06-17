import 'dotenv/config';

import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import * as fs from 'fs';

import { Response, NextFunction } from 'express';
import { GraphQLSchema } from 'graphql';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { fileLoader } from 'merge-graphql-schemas';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import ormconfig from './../ormconfig.js';
import typeormdbc from './ormconnection';
import decodeJWT from './utils/token/decodeJWT';

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// import passport from 'passport'; 패스포트 사용 잠정 중단
// import localPassAuth from './utils/passport/LocalAuth';
// import decodeJWT from './utils/token/decodeJWT';

/*<----------------------------import schema-------------------------------->*/

const schemas: GraphQLSchema[] = [];
const folders = fs.readdirSync(path.join(__dirname, './api'));
folders.forEach((folder) => {
	if (folder !== 'shared.graphql') {
		const resolvers = fileLoader(path.join(__dirname, `./api/${folder}/${folder}.resolvers.ts`));
		const typeDefs = importSchema(path.join(__dirname, `./api/${folder}/${folder}.graphql`));
		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
	}
});

/*<----------------------------class App-------------------------------->*/

class App {
	public app: GraphQLServer;
	private pubSub: any;
	constructor() {
		const schema: any = mergeSchemas({ schemas });
		this.pubSub = new PubSub();
		this.pubSub.ee.setMaxListeners(99);
		this.app = new GraphQLServer({
			schema,
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
		this.app.express.use(
			session({
				secret: process.env.SESSION_SECRET || 'ADFA',
				store: new MySQLStore({
					...ormconfig,
					user: process.env.DB_USERNAME,
					password: process.env.DB_PASSWORD,
				}),
				cookie: {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: 1000 * 60 * 60 * 24 * 21, // 21 days
				},
			})
		);
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
