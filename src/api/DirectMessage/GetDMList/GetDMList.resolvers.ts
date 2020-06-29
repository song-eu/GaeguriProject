import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Message } from '../../../entities/Message';

export const resolvers: ResolverMap = {
	Query: {
		GetDMList: privateResolver(async (_, __, { req }) => {
			const { User_id } = req.user;
			try {
				const list = await Message.createQueryBuilder('M')
					.where('M.User1_id = :User1_id', {
						User1_id: User_id,
					})
					.orWhere('M.User2_id = :User2_id', {
						User2_id: User_id,
					})
					.leftJoinAndSelect('M.dm', 'DM')
					.leftJoinAndSelect('M.user1', 'U1')
					.leftJoinAndSelect('M.user2', 'U2')
					.getMany();

				return {
					ok: true,
					error: null,
					list,
					path: 'GetDMList',
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					list: null,
					path: 'GetDMList',
				};
			}
		}),
	},
};
