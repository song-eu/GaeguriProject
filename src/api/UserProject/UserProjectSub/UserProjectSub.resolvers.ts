import { withFilter } from 'graphql-yoga';

const NEW_PARTICIPATION_APPLY = 'NEW_PARTICIPATION_APPLY';

export const resolvers = {
	Subscription: {
		newApplySub: {
			subscribe: (_: any, __: any, { pubSub }: any) => {
				return pubSub.asyncIterator(NEW_PARTICIPATION_APPLY);
			} /* ,
				async (payload, _, { context }) => {
					const {
						newApplySub: { Project_id },
					} = payload;
					try {
						return true;
					} catch (error) {
						return false;
					}
				} */,
		},
	},
};
