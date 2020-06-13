import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import logger from 'morgan';

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
	Query: {
		hello: (_, { name }) => `Hello ${name || 'World'}`,
	},
};

class App {
	public app: GraphQLServer;
	constructor() {
		this.app = new GraphQLServer({ typeDefs, resolvers });
		this.middlewares();
	}
	private middlewares = (): void => {
		this.app.express.use(cors());
		this.app.express.use(logger('dev'));
	};
}

export default new App().app;
