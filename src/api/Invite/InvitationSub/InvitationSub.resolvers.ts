import { withFilter } from 'graphql-yoga';
import { Project } from '../../../entities/Project';
import { Position } from '../../../entities/Position';
import { User } from '../../../entities/User';

const SEND_INVITATION = 'SEND_INVITATION';

export const resolvers = {
	Subscription: {
		invitationSub: {
			resolve: async (payload, _, __) => {
				console.log('payload ------- resolver', payload);
				const {
					invitationSub: { Project_id, Position_id, Sender_id },
				} = payload;
				const prj = await Project.findOne({ Project_id });
				const position = await Position.findOne({ Position_id });
				const sender = await User.findOne({ User_id: Sender_id });

				const data = {
					Project_id: Project_id,
					Project_name: prj.Project_name,
					Position_id: Position_id,
					Position_name: position.Position_name,
					Sender_id: Sender_id,
					Sender_Email: sender.Email,
					Sender_Username: sender.Username,
				};
				console.log('data?????????---------', data);
				return data;
			},
			subscribe: withFilter(
				(_, __, { pubSub }) => {
					return pubSub.asyncIterator(SEND_INVITATION);
				},
				async (payload, _, { connectionContext }) => {
					const {
						invitationSub: { Candidate_id },
					} = payload;
					const user = connectionContext.currentUser;
					try {
						if (Candidate_id === user.User_id) {
							return true;
						}
					} catch (error) {
						return false;
					}
				}
			),
		},
	},
};
