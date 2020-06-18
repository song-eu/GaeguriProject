import { ResolverMap, privateResolver } from '../../types/graphql.utils';

export const resolvers: ResolverMap = {
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
