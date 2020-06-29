import { withFilter } from 'graphql-yoga';
import { DirectMessage } from '../../../entities/DirectMessage';

export const resolvers = {
	Subscription: {
		DMSub: {
			subscribe: withFilter(
				//must return boolean
				(_, __, { pubSub }) => pubSub.asyncIterator('newDirectMessage'),
				async (payload, _) => {
					//const user: User = context.currentUser;
					const {
						DMSub: { Message_id },
					} = payload;
					try {
						const dm = await DirectMessage.find({ Message_id });
						if (dm.length) {
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
