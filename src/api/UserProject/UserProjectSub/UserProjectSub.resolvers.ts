import { withFilter } from 'graphql-yoga';
import { Project } from '../../../entities/Project';
import { Position } from '../../../entities/Position';
import { User } from '../../../entities/User';

const NEW_PARTICIPATION_APPLY = 'NEW_PARTICIPATION_APPLY';
const ACCEPT_INVITATION = 'ACCEPT_INVITATION';

export const resolvers = {
	Subscription: {
		newApplySub: {
			resolve: async (payload, _, __) => {
				//console.log('payload?????', payload);
				const {
					newApplySub: { Project_id, Position_id, User_id },
				} = payload;
				const prj = await Project.findOne({ Project_id });
				const position = await Position.findOne({ Position_id });
				const user = await User.findOne({ User_id });

				const data = {
					Project_id: Project_id,
					Project_name: prj.Project_name,
					Position_id: Position_id,
					Position_name: position.Position_name,
					User_id: User_id,
					Email: user.Email,
					Username: user.Username,
				};
				return data;
			},
			subscribe: withFilter(
				(_, __, { pubSub }) => {
					return pubSub.asyncIterator(NEW_PARTICIPATION_APPLY);
				},
				async (payload, _, { connectionContext }) => {
					//console.log('payload------------', payload);
					//console.log('req------------', connectionContext.currentUser);
					//console.log('currentUser------------', currentUser);
					const user = connectionContext.currentUser;
					const {
						newApplySub: { Project_id },
					} = payload;
					try {
						const project = await Project.findOne({ Project_id });
						if (project.Owner_id === user.User_id) {
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
		acceptInvitationSub: {
			resolve: async (payload, _, __) => {
				//console.log('payload?????', payload);
				const {
					acceptInvitationSub: { Project_id, Position_id, User_id },
				} = payload;
				const prj = await Project.findOne({ Project_id });
				const position = await Position.findOne({ Position_id });
				const user = await User.findOne({ User_id });

				const data = {
					Project_id: Project_id,
					Project_name: prj.Project_name,
					Position_id: Position_id,
					Position_name: position.Position_name,
					User_id: User_id,
					Email: user.Email,
					Username: user.Username,
				};
				return data;
			},
			subscribe: withFilter(
				(_, __, { pubSub }) => {
					return pubSub.asyncIterator(ACCEPT_INVITATION);
				},
				async (payload, _, { connectionContext }) => {
					//console.log('payload------------', payload);
					//console.log('req------------', connectionContext.currentUser);
					//console.log('currentUser------------', currentUser);
					const user = connectionContext.currentUser;
					const {
						acceptInvitationSub: { Project_id, Sender_id },
					} = payload;
					try {
						const project = await Project.findOne({ Project_id });
						if (project.Owner_id === user.User_id || Sender_id === user.User_id) {
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
