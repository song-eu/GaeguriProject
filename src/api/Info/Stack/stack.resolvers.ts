import { ResolverMap } from '../../../types/graphql.utils';
import { Stack } from '../../../entities/Stack';

export const resolvers: ResolverMap = {
	Query: {
		stackAll: async (_, __) => {
			const stacks = await Stack.find();
			console.log(stacks);
			return stacks;
		},
	},
};
