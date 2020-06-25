import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Like } from 'typeorm';
import { User } from '../../../entities/User';

export const resolvers: ResolverMap = {
	Query: {
		SearchUser: privateResolver(async (_, args: GQL.SearchUserQueryArgs, { req }) => {
			const { keyword } = args;
			try {
				const users = await User.find({
					where: { User_id: 2 },
					/*where: { Username: Like(`%${keyword}#%`) },
					 join: {
						alias: 'user',
						leftJoinAndSelect: {
							UserStack: 'user.userstack',
							Position: 'user.position',
						},
						leftJoin: { Stack: 'UserStack.stack' },
					}, */
				});
				return {
					ok: true,
					error: null,
					users,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					users: null,
				};
			}
		}),
	},
};
