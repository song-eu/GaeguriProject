import 'reflect-metadata';

import { GraphQLServer } from 'graphql-yoga';
import typeormdbc from './ormconnection';

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

const server = new GraphQLServer({ typeDefs, resolvers });

typeormdbc.then(() => server.start(() => console.log('Server is running on localhost:4000')));
