import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import { Project } from '../../../entities/Project';

export const resolvers: ResolverMap = {
	Query: {
		GetMyProfile: privateResolver(async (_, __, { req }) => {
			const { User_id } = req.user;
			try {
				const user = await User.createQueryBuilder('User')
					.leftJoinAndSelect('User.userstack', 'US')
					.leftJoinAndSelect('User.position', 'UP')
					.leftJoin('US.stack', 'Stack')
					.addSelect('Stack.Stack_name')
					.where({ User_id })
					.getOne();

				const project = await Project.createQueryBuilder('Project')
					.leftJoinAndSelect('Project.projectpositionno', 'ppn')
					.leftJoin('ppn.position', 'position')
					.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed')
					.leftJoin('PC.candidate', 'PCU')
					.where((qb) => {
						//------------------------아래 subQuery부분이 User_id 를 가지고 'allowed'된 프로젝트를 찾는부분'
						const subQuery = qb
							.subQuery()
							.select('PC.Project_id')
							.from('PCProjectCandidate', 'PC')
							.leftJoin('PC.PP', 'PP')
							.where('PC.Candidate_id = :user_id and PC.Allowed = :allowed', { user_id: User_id })
							.select('DISTINCT PP.Project_id', 'Project_id')
							.getQuery();
						return 'Project.Project_id IN ' + subQuery; // 찾은 프로젝트를 Project_id 로 찾는 부분
					})
					.setParameter('allowed', 'Allowed')
					.addSelect('position.Position_name')
					.addSelect('project.status')
					.addSelect('PC')
					.addSelect('PCU')
					.getMany();

				return {
					ok: true,
					error: null,
					user,
					project,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					user: null,
					project: null,
				};
			}
		}),
	},
};
