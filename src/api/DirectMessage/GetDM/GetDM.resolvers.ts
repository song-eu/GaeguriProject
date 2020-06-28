import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Message } from '../../../entities/Message';

export const resolvers: ResolverMap = {
	Query: {
		GetDM: privateResolver(async (_, args: GQL.GetDMQueryArgs, { req }) => {
			const { Message_id } = args;
			const { User_id } = req.user;
			try {
				const message = await Message.findOne({ Message_id }, { relations: ['dm'] });
				if (message) {
					if (message.User1_id === User_id || message.User2_id === User_id) {
						return {
							ok: true,
							error: null,
							message,
							path: 'GetMessage',
						};
					} else {
						return {
							ok: false,
							error: '메세지를 볼 수 없는 유저입니다',
							message: null,
							path: 'GetMessage',
						};
					}
				} else {
					return {
						ok: false,
						error: '메세지를 찾을 수 없습니다',
						message: null,
						path: 'GetMessage',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					message: null,
					path: 'GetMessage',
				};
			}
		}),
	},
};
