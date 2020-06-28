import { Chat } from '../../../entities/Chat';
import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';

export const resolvers: ResolverMap = {
	Mutation: {
		//subscription 으로 모니터 되고 있는 데이터는,
		//playground 에서 mutation 을 진행했다고 그 변화가 바로 보이지 않는다.
		//보고 싶다면 새로운 브라우져를 켜서 확인해야 한다.
		SendChat: privateResolver(async (_, args: GQL.SendChatMutationArgs, { req, pubSub }) => {
			const { User_id } = req.user;
			const { Project_id, Contents } = args;

			try {
				const project = await Project.findOne({ Project_id });
				if (project) {
					const chat = await Chat.create({ User_id, Project_id, Contents }).save();
					pubSub.publish('newChatMessage', { ChatSub: chat });
					return {
						ok: true,
						error: null,
						chat,
						path: 'SendChat',
					};
				} else {
					return {
						ok: false,
						error: '프로젝트 방을 통한 접근이 아닙니다',
						chat: null,
						path: 'SendChat',
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					chat: null,
					path: 'SendChat',
				};
			}
		}),
	},
};
