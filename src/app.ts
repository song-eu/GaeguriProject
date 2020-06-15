import 'dotenv/config';

import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import * as fs from 'fs';
import passport from 'passport';

import { GraphQLSchema } from 'graphql';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { fileLoader } from 'merge-graphql-schemas';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import typeormdbc from './ormconnection';
import localPassAuth from './utils/passport/LocalAuth';
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

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
	constructor() {
		const schema: any = mergeSchemas({ schemas });
		this.app = new GraphQLServer({ schema, context: ({ request, response }) => ({ request }) });
		this.middlewares();

		//passport기본설정 및 데이터 베이스 커넥터
		localPassAuth();
		typeormdbc();
	}
	private middlewares = (): void => {
		this.app.express.use(
			session({
				secret: process.env.SESSION_SECRET || 'ADFA',
				store: new MySQLStore({
					host: 'localhost',
					port: 3306,
					user: process.env.DB_USERNAME,
					password: process.env.DB_PASSWORD,
					database: 'session',
				}),
				cookie: {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: 1000 * 60 * 60 * 24 * 21, // 21 days
				},
			})
		);
		this.app.express.use(passport.initialize());
		this.app.express.use(passport.session());
		this.app.express.use(cors());
		this.app.express.use(logger('dev'));
		this.app.express.post('/login');
	};
}

export default new App().app;
