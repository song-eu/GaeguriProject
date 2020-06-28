import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Message } from '../../../entities/Message';
import { DirectMessage } from '../../../entities/DirectMessage';

export const resolvers: ResolverMap = {
	Mutation: {
		// 대화를 나눈 적이 없는 유저라면 -> 메세지 방부터 만드는 걸 실행
		SendDM: privateResolver(async (_, args: GQL.SendDMMutationArgs, { req, pubSub }) => {
			const Sender_id = req.user.User_id;
			const { Message_id, Receiver_id, Contents } = args;

			try {
				let message = Message_id
					? await Message.findOne({ Message_id })
					: await Message.create({ User1_id: Sender_id, User2_id: Receiver_id }).save();

				const dm = await DirectMessage.create({ Message_id: message.Message_id, User_id: Sender_id, Contents }).save();
				pubSub.publish('newDirectMessage', { DMSub: dm });

				return {
					ok: true,
					error: null,
					dm,
					path: 'SendMessage',
				};
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
