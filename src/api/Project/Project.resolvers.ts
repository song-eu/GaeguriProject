import * as bcrypt from 'bcryptjs';
//import { GraphQLServer } from 'graphql-yoga';
//import { ResolverMap } from './types/graphql.utils';
//import { User } from './entity/User';
import { ResolverMap } from '../../types/graphql.utils';
import { Project } from '../../entity/Project';
import { Position } from '../../entity/Position';
import { PPProjectPositionNo } from '../../entity/PP_ProjectPositionNo';
import { PSProjectStack } from '../../entity/PS_ProjectStack';
import { Stack } from '../../entity/Stack';
import { PCProjectCandidate } from '../../entity/PC_ProjectCandidate';
import { User } from '../../entity/User';

export const resolvers: ResolverMap = {
	Query: {
		hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
		getMyProjectList: async (_, { User_id }) => {
			let projectList = [];
			const pc = await PCProjectCandidate.createQueryBuilder('PC')
				.where('PC.Candidate_id = :id and PC.Allowed = :allowed', { id: User_id, allowed: 'Allowed' })
				.getMany();
			console.log(pc);
			for (let i = 0; i < pc.length; i++) {
				const prj = await Project.createQueryBuilder('Project')
					.leftJoinAndSelect('Project.projectstack', 'Stack')
					.leftJoinAndSelect('Project.projectpositionno', 'StatusOfPosition')
					.where('Project.Project_id = :id', { id: pc[i].Project_id })
					.getOne();
				projectList.push(prj);
				console.log(projectList);
			}
		},
	},
	Mutation: {
		createNewProject: async (_, { Project_name, StartAt, EndAt, Desc, NoOfPosition, User_id, Stacks }) => {
			//console.log('NoOfPosition??', NoOfPosition);
			const project = Project.create({
				Project_name,
				StartAt,
				EndAt,
				Desc,
				createdBy: User_id,
			});
			const projectSave = await project.save();
			const pc = new PCProjectCandidate();
			pc.Project_id = projectSave.Project_id;
			for (let i = 0; i < NoOfPosition.length; i++) {
				let position = await Position.createQueryBuilder('Position')
					.where('Position.Position_name = :name', { name: NoOfPosition[i].name })
					.getOne();
				if (position === undefined) {
					const newPosition = Position.create({ Position_name: NoOfPosition[i].name });
					position = await newPosition.save();
				}
				const pp = new PPProjectPositionNo();
				pp.Project_id = projectSave.Project_id;
				pp.Position_id = position.Position_id;
				pp.NoOfPosition = NoOfPosition[i].count;
				if (i === 0) pc.Position_id = pp.Position_id;
				await pp.save();
				//console.log('pp', pp);
			}
			for (let i = 0; i < Stacks.length; i++) {
				const ps = new PSProjectStack();
				ps.Project_id = projectSave.Project_id;

				let getStack = await Stack.createQueryBuilder('Stack')
					.where('Stack.Stack_name = :name', { name: Stacks[i] })
					.getOne();

				if (getStack === undefined) {
					const newStack = await Stack.create({ Stack_name: Stacks[i] });
					getStack = await newStack.save();
				}
				ps.Stack_id = getStack.Stack_id;

				await ps.save();
				//console.log('ps', ps);
			}
			pc.Candidate_id = User_id;
			pc.Allowed = 'Allowed';
			pc.Owner = true;

			await pc.save();
			//console.log('pc', pc);

			let prj = await Project.createQueryBuilder('Project')
				.leftJoinAndSelect('Project.projectstack', 'ps')
				.leftJoinAndSelect('Project.projectpositionno', 'ppn')
				.where('Project.Project_id = :id', {
					id: projectSave.Project_id,
				})
				.getOne();
			console.log('prj', prj);

			return null;
		},
	},
};
