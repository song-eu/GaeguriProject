import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import logger from 'morgan';
import { importSchema } from 'graphql-import';
//import { resolvers } from './resolvers';
import path from 'path';
import * as fs from 'fs';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { fileLoader } from 'merge-graphql-schemas';

const schemas: GraphQLSchema[] = [];
const folders = fs.readdirSync(path.join(__dirname, './api'));
folders.forEach((folder) => {
	if (folder !== 'shared.graphql') {
		const resolvers = fileLoader(path.join(__dirname, `./api/${folder}/${folder}.resolvers.ts`));
		const typeDefs = importSchema(path.join(__dirname, `./api/${folder}/${folder}.graphql`));
		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
	}
});

class App {
	public app: GraphQLServer;
	constructor() {
		const schema: any = mergeSchemas({ schemas });
		this.app = new GraphQLServer({ schema });
		this.middlewares();
	}
	private middlewares = (): void => {
		this.app.express.use(cors());
		this.app.express.use(logger('dev'));
	};
}

export default new App().app;
