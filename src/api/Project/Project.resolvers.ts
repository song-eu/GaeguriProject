import * as bcrypt from 'bcryptjs';
//import { GraphQLServer } from 'graphql-yoga';
//import { ResolverMap } from './types/graphql.utils';
//import { User } from './entities/User';
import { ResolverMap } from '../../types/graphql.utils';
import { Project } from '../../entities/Project';
import { Position } from '../../entities/Position';
import { PPProjectPositionNo } from '../../entities/PP_ProjectPositionNo';
import { PSProjectStack } from '../../entities/PS_ProjectStack';
import { Stack } from '../../entities/Stack';
import { PCProjectCandidate } from '../../entities/PC_ProjectCandidate';
import { User } from '../../entities/User';
import { createQueryBuilder } from 'typeorm';

export const resolvers: ResolverMap = {
	Query: {
		hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
		getMyProjectList: async (_, { User_id }) => {
			//console.log(User_id);
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
			return project;
		},
	},
	Mutation: {
		createNewProject: async (_, { Project_name, StartAt, EndAt, Desc, NoOfPosition, User_id, Stacks }) => {
			//console.log('NoOfPosition??', NoOfPosition);
			const newProject = new Project();
			newProject.Project_name = Project_name;
			newProject.StartAt = StartAt;
			newProject.EndAt = EndAt;
			newProject.Desc = Desc;
			newProject.createdBy = User_id;
			newProject.owner_id = User_id;
			await newProject.save();

			for (let i = 0; i < NoOfPosition.length; i++) {
				let newPosition = await Position.findOne({ where: { Position_name: NoOfPosition[i].name } });
				if (!newPosition) {
					newPosition = await Position.create({ Position_name: NoOfPosition[i].name });
					await newPosition.save();
				}
				const newNOP = new PPProjectPositionNo();
				newNOP.Project_id = newProject.Project_id;
				newNOP.Position_id = newPosition.Position_id;
				newNOP.NoOfPosition = NoOfPosition[i].count;
				await newNOP.save();
				if (i === 0) {
					const newPC = new PCProjectCandidate();
					console.log('PPID', newNOP.PP_id);
					newPC.Project_Postion_id = newNOP.PP_id;
					newPC.Candidate_id = User_id;
					newPC.Allowed = 'Allowed';
					await newPC.save();
				}
			}
			Stacks.forEach(async (st) => {
				let newStack = await Stack.findOne({ where: { Stack_name: st } });
				if (!newStack) {
					newStack = await Stack.create({ Stack_name: st });
					await newStack.save();
				}
				const newPS = new PSProjectStack();
				newPS.Project_id = newProject.Project_id;
				newPS.Stack_id = newStack.Stack_id;
				await newPS.save();
			});
			return null;
		},
	},
};
