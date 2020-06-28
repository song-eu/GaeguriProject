import { withFilter } from 'graphql-yoga';
import { Chat } from '../../../entities/Chat';
//import { User } from '../../../entities/User';

export const resolvers = {
	Subscription: {
		ChatSub: {
			subscribe: withFilter(
				//must return boolean
				(_, __, { pubSub }) => pubSub.asyncIterator('newChatMessage'),
				async (payload, _, { context }) => {
					//const user: User = context.currentUser;
					const {
						ChatSub: { Project_id },
					} = payload;
					try {
						const chat = await Chat.find({ Project_id });
						if (chat.length) {
							return true;
						} else {
							return false;
						}
					} catch (error) {
						return false;
					}
				}
			),
		},
	},
};
