import { withFilter } from 'graphql-yoga';
import { Message } from '../../../entities/Message';
import { User } from '../../../entities/User';

export const resolvers = {
	Subscription: {
		DMSub: {
			subscribe: withFilter(
				//must return boolean
				(_, __, { pubSub }) => pubSub.asyncIterator('newDirectMessage'),
				async (payload, _, { context }) => {
					const user: User = context.currentUser;
					const {
						DMSub: { Message_id },
					} = payload;
					try {
						const message = await Message.findOne({ Message_id });
						if (message) {
							return message.User1_id === user.User_id || message.User2_id === user.User_id;
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
