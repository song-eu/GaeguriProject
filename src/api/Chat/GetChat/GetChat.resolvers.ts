import { Chat } from '../../../entities/Chat';
import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';

export const resolvers: ResolverMap = {
	Query: {
		GetChat: privateResolver(async (_, args: GQL.GetChatQueryArgs) => {
			const { Project_id } = args;
			try {
				const project = await Project.findOne({ Project_id });
				if (project) {
					const chat = await Chat.find({ Project_id });
					return {
						ok: true,
						error: null,
						chat,
						path: 'GetChat',
					};
				} else {
					return {
						ok: false,
						error: 'project 가 없습니다',
						chat: null,
						path: 'GetChat',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					chat: null,
					path: 'GetChat',
				};
			}
		}),
	},
};
