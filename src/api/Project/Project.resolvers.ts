import * as bcrypt from 'bcryptjs';
//import { GraphQLServer } from 'graphql-yoga';
//import { ResolverMap } from './types/graphql.utils';
//import { User } from './entity/User';
import { ResolverMap } from '../../types/graphql.utils';

export const resolvers: ResolverMap = {
	Query: {
		hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
	},
};
