import { Chat } from '../../../entities/Chat';
import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';
import { User } from '../../../entities/User';

export const resolvers: ResolverMap = {
	Query: {
		GetChat: privateResolver(async (_, args: GQL.GetChatQueryArgs, { req, pubSub }) => {
			const { Project_id } = args;
			const { User_id } = req.user;
			try {
				const project = await Project.findOne({ Project_id });
				if (project) {
					const chat = await Chat.find({ Project_id });
					const user = await User.findOne({ User_id });
					return {
						ok: true,
						error: null,
						chat,
						user,
						path: 'GetChat',
					};
				} else {
					return {
						ok: false,
						error: 'project 가 없습니다',
						chat: null,
						user: null,
						path: 'GetChat',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					chat: null,
					user: null,
					path: 'GetChat',
				};
			}
		}),
	},
};
