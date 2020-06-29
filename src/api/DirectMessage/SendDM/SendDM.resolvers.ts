import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Message } from '../../../entities/Message';
import { DirectMessage } from '../../../entities/DirectMessage';

export const resolvers: ResolverMap = {
	Mutation: {
		SendDM: privateResolver(async (_, args: GQL.SendDMMutationArgs, { req, pubSub }) => {
			const { User_id } = req.user;
			const { Message_id, Contents } = args;

			try {
				const message = await Message.findOne({ Message_id });
				if (message) {
					const dm = await DirectMessage.create({ Message_id, User_id, Contents }).save();
					pubSub.publish('newDirectMessage', { DMSub: dm });

					return {
						ok: true,
						error: null,
						dm,
						path: 'SendMessage',
					};
				} else {
					return {
						ok: false,
						error: 'DM을 우선 오픈하세요',
						dm: null,
						path: 'sendMessage',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					dm: null,
					path: 'SendMessage',
				};
			}
		}),
	},
};
