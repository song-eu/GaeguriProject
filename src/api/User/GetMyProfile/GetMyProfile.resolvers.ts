import { ResolverMap, privateResolver } from '../../../types/graphql.utils';

const resolvers: ResolverMap = {
	Query: {
		GetMyProfile: privateResolver(async (_, __, { req }) => {
			const { user } = req.user;
			return {
				ok: true,
				error: null,
				user,
			};
		}),
	},
};

export default resolvers;
