import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Message } from '../../../entities/Message';
import { DirectMessage } from '../../../entities/DirectMessage';

export const resolvers: ResolverMap = {
	Query: {
		GetDM: privateResolver(async (_, args: GQL.GetDMQueryArgs, { req }) => {
			const { Message_id } = args;
			try {
				const message = await Message.findOne({ Message_id });
				if (message) {
					const dm = await DirectMessage.find({ Message_id });
					return {
						ok: true,
						error: null,
						dm,
						path: 'GetMessage',
					};
				} else {
					return {
						ok: false,
						error: '메세지를 찾을 수 없습니다',
						dm: null,
						path: 'GetMessage',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					dm: null,
					path: 'GetMessage',
				};
			}
		}),
	},
};
