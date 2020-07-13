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
					const chat = await Chat.createQueryBuilder('Chat')
						.leftJoinAndSelect('Chat.user', 'ChatUser')
						.where({ Project_id: project.Project_id })
						.getMany();

					return {
						ok: true,
						error: null,
						chat,
						path: 'GetChat',
						Project_id,
					};
				} else {
					return {
						ok: false,
						error: 'project 가 없습니다',
						chat: null,
						path: 'GetChat',
						Project_id,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					chat: null,
					path: 'GetChat',
					Project_id: null,
				};
			}
		}),
	},
};
