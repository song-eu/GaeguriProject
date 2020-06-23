import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';

export const resolvers: ResolverMap = {
	Query: {
		GetYourProfile: privateResolver(async (_, args: GQL.GetYourProfileQueryArgs, { req }) => {
			try {
				const { User_id, Username } = args;
				const user = await User.createQueryBuilder('User')
					.leftJoinAndSelect('User.userstack', 'US')
					.leftJoinAndSelect('User.position', 'UP')
					.leftJoin('US.stack', 'Stack')
					.addSelect('Stack.Stack_name')
					.where({ User_id })
					.getOne();

				if (user) {
					return {
						ok: true,
						error: null,
						user,
					};
				} else {
					return {
						ok: false,
						error: '해당 유저를 찾을 수 없습니다',
						user: null,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: '유저 찾기에 실패했습니다 다시 시도해 주세요',
					user: null,
				};
			}
		}),
	},
};
