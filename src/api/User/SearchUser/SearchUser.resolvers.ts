import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';

export const resolvers: ResolverMap = {
	Query: {
		SearchUser: privateResolver(async (_, args: GQL.SearchUserQueryArgs, { req }) => {
			const { keywords } = args;
			try {
				const users = await User.createQueryBuilder('User')
					.leftJoinAndSelect('User.userstack', 'US')
					.leftJoinAndSelect('User.position', 'UP')
					.leftJoin('US.stack', 'Stack')
					.addSelect('Stack.Stack_name')
					.where('User.Username like :name', { name: `%${keywords}%` })
					.getMany();

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
