import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';

export const resolvers: ResolverMap = {
	Query: {
		GetMyProfile: privateResolver(async (_, __, { req }) => {
			const { User_id } = req.user;
			const user = await User.createQueryBuilder('User')
				.leftJoinAndSelect('User.userstack', 'US')
				.leftJoinAndSelect('User.position', 'UP')
				.leftJoin('US.stack', 'Stack')
				.addSelect('Stack.Stack_name')
				.where({ User_id })
				.getOne();

			/**
				 * console.log(input);
			const { User_id, Project_id, Position_id } = input;

			let inPC = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
				.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
				.where({
					Project_id,
				})
				.andWhere('Candidate_id = :cid and Allowed = :allowed', { cid: User_id, allowed: 'Allowed' })
				.getOne();
				 */

			return {
				ok: true,
				error: null,
				user,
			};
		}),
	},
};
