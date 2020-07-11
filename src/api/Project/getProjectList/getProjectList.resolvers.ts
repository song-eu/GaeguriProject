import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';
import { In } from 'typeorm';

export const resolvers: ResolverMap = {
	Query: {
		hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
		getMyProjectList: privateResolver(async (_, args, { req }) => {
			//console.log(User_id);
			const User_id = req.user.User_id;
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
			//console.log(project[0].projectpositionno[0]);
			//console.log(project[0].projectpositionno[0].PC);
			//console.log(project[0].projectstack);
			//console.log('projectStack', projectStack.getMany());
			//console.log(project[0].projectpositionno[0].PC[0].candidate);
			return project;
		}),
		getAvailableProjectList: privateResolver(async (_, args, { req }) => {
			const User_id = req.user.User_id;
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
						// 참여가능한 방 리스트 - 내유저아이디가 allowed 로 참여되었거나 참여 요청 했으나 rejected 로 거절된 프로젝트 방 제외
						.where('PC.Candidate_id = :user_id and PC.Allowed = :allowed', {
							user_id: User_id,
						})
						.orWhere('PC.Candidate_id = :user_id and PC.Sender_id is null and PC.Allowed = :rejected ', {
							user_id: User_id,
							rejected: 'Rejected',
						})
						.select('DISTINCT PP.Project_id', 'Project_id')
						.getQuery();
					return 'Project.Project_id NOT IN ' + subQuery;
				})
				.setParameter('allowed', 'Allowed')
				.addSelect('stack.Stack_name')
				.addSelect('position.Position_name')
				.addSelect('PC')
				.addSelect('PCU')
				.orderBy('Project.createdAt', 'DESC')
				.getMany();
			//console.log(project[0].projectpositionno[0]);
			//console.log(project[0].projectpositionno[0].PC);
			//console.log(project[0].projectstack);
			//console.log('projectStack', projectStack.getMany());
			return project;
		}),
		getProjectDetail: privateResolver(async (_, { Project_id }, { req }) => {
			const project = await Project.createQueryBuilder('Project')
				.leftJoinAndSelect('Project.projectpositionno', 'ppn')
				.leftJoinAndSelect('Project.projectstack', 'ps')
				.leftJoin('ps.stack', 'stack')
				.leftJoin('ppn.position', 'position')
				.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
				.leftJoin('PC.candidate', 'PCU')
				.where('Project.Project_id = :Project_id')
				.setParameter('Project_id', Project_id)
				.addSelect('stack.Stack_name')
				.addSelect('position.Position_name')
				.addSelect('PC')
				.addSelect('PCU')
				.getOne();

			return project;
		}),
		getMyProjectListwithStatus: privateResolver(async (_, __, { req }) => {
			const User_id = req.user.User_id;
			try {
				const onGoingList = await Project.createQueryBuilder('Project')
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
					.andWhere('Project.status IN (:statusarr)')
					.setParameter('statusarr', ['await', 'Start'])
					.setParameter('allowed', 'Allowed')
					.addSelect('stack.Stack_name')
					.addSelect('position.Position_name')
					.addSelect('PC')
					.addSelect('PCU')
					.getMany();
				console.log('-------ongoing list', onGoingList);

				const endedList = await Project.createQueryBuilder('Project')
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
					.andWhere('Project.status IN (:statusarr)')
					.setParameter('statusarr', ['End'])
					.setParameter('allowed', 'Allowed')
					.addSelect('stack.Stack_name')
					.addSelect('position.Position_name')
					.addSelect('PC')
					.addSelect('PCU')
					.getMany();

				const statusProject = {
					onGoing: onGoingList,
					end: endedList,
				};
				return {
					ok: true,
					path: 'getMyProjectListwithStatus',
					error: null,
					statusProject,
				};
			} catch (err) {
				return {
					ok: false,
					path: 'getMyProjectListwithStatus',
					error: err.message,
					statusProject: null,
				};
			}
		}),
	},
};
