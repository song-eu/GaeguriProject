import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Message } from '../../../entities/Message';

export const resolvers: ResolverMap = {
	Mutation: {
		OpenDM: privateResolver(async (_, args: GQL.OpenDMMutationArgs, { req }) => {
			const { User_id } = req.user;
			const { Receiver_id } = args;
			try {
				let message = await Message.createQueryBuilder('M')
					.where('M.User1_id = :User1_id AND M.User2_id = :User2_id', {
						User1_id: User_id,
						User2_id: Receiver_id,
					})
					.orWhere('M.User1_id = :U1_id AND M.User2_id = :U2_id', {
						U1_id: 10,
						U2_id: 3,
					})
					.getOne();
				if (!message) {
					message = await Message.create({ User1_id: User_id, User2_id: Receiver_id }).save();
					return {
						ok: true,
						error: null,
						message,
						path: 'OpenDM',
					};
				} else {
					return {
						ok: false,
						error: '이미 오픈된 dm이 있습니다',
						message,
						path: 'OpenDM',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					message: null,
					path: 'OpenDM',
				};
			}
		}),
	},
};
