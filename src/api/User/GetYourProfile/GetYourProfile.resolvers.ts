import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import { Project } from '../../../entities/Project';

export const resolvers: ResolverMap = {
	Query: {
		GetYourProfile: privateResolver(async (_, args: GQL.GetYourProfileQueryArgs, { req }) => {
			try {
				const { User_id, Username } = args;

				const user = await User.createQueryBuilder('User')
					.leftJoinAndSelect('User.userstack', 'US')
					.leftJoinAndSelect('User.position', 'UP')
					.leftJoin('US.stack', 'Stack')
					.addSelect('Stack.Stack_name')
					.where({ User_id })
					.getOne();

				const project = await Project.createQueryBuilder('Project')
					.leftJoinAndSelect('Project.projectpositionno', 'ppn')
					.leftJoinAndSelect('Project.projectstack', 'ps')
					.leftJoin('ps.stack', 'stack')
					.leftJoin('ppn.position', 'position')
					.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed')
					.leftJoin('PC.candidate', 'PCU')
					.where((qb) => {
						const subQuery = qb
							.subQuery()
							.select('PC.Project_id')
							.from('PCProjectCandidate', 'PC')
							.leftJoin('PC.PP', 'PP')
							.where('PC.Candidate_id = :user_id and PC.Allowed = :allowed', { user_id: User_id })
							.select('DISTINCT PP.Project_id', 'Project_id')
							.getQuery();
						return 'Project.Project_id IN ' + subQuery;
					})
					.setParameter('allowed', 'Allowed')
					.addSelect('stack.Stack_name')
					.addSelect('position.Position_name')
					.addSelect('PC')
					.addSelect('PCU')
					.getMany();

				if (user) {
					return {
						ok: true,
						error: null,
						user,
						project,
					};
				} else {
					return {
						ok: false,
						error: '해당 유저를 찾을 수 없습니다',
						user: null,
						project: null,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: '유저 찾기에 실패했습니다 다시 시도해 주세요',
					user: null,
					project: null,
				};
			}
		}),
	},
};
