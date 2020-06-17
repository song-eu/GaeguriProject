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

export const resolvers: ResolverMap = {
	Query: {
		hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
		testQuery: async (_, { User_id }) => {
			//console.log(User_id);
			const project = await Project.createQueryBuilder('Project')
				.leftJoinAndSelect('Project.projectpositionno', 'ppn')
				.leftJoinAndSelect('Project.projectstack', 'ps')
				.leftJoin('ps.stack', 'stack')
				.leftJoin('ppn.position', 'position')
				.where('Project.Project_id = :id', {
					id: 2,
				})
				.addSelect('stack.Stack_name')
				.addSelect('position.Position_name')
				.getMany();
			console.log(project);
			console.log(project[0].projectpositionno);
			console.log(project[0].projectstack);
			//console.log('projectStack', projectStack.getMany());
			return Project;
		},
		getMyProjectList: async (_, { User_id }) => {
			var projectList = [];
			const projectIdList = await PCProjectCandidate.createQueryBuilder('PC')
				.select('PC.Project_id')
				.where('PC.Candidate_id = :id and PC.Allowed = :allowed', { id: User_id, allowed: 'Allowed' })
				.getMany();
			//console.log(projectIdList);
			for (let i = 0; i < projectIdList.length; i++) {
				const prj = await Project.createQueryBuilder('Project')
					.leftJoinAndSelect('Project.projectstack', 'Stack')
					.leftJoinAndSelect('Project.projectpositionno', 'StatusOfPosition')
					.where('Project.Project_id = :id', { id: projectIdList[i].Project_id })
					.getOne();
				//projectList.push(prj);

				let prjInfo = {
					Project_id: prj.Project_id,
					Project_name: prj.Project_name,
					Status: prj.status,
					Stack: [],
					StatusOfPosition: [],
					Owner: 0,
				};

				for (let n = 0; n < prj.projectstack.length; n++) {
					const st = await Stack.createQueryBuilder('Stack')
						.where('Stack.Stack_id = :id', {
							id: prj.projectstack[n].Stack_id,
						})
						.getOne();
					//console.log(st.Stack_name);
					prjInfo['Stack'].push(st.Stack_name);
				}
				for (let m = 0; m < prj.projectpositionno.length; m++) {
					const pp = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
						.leftJoinAndSelect('PPProjectPositionNo.position', 'position')
						.where('PPProjectPositionNo.Project_id = :project_id and PPProjectPositionNo.Position_id = :position_id', {
							position_id: prj.projectpositionno[m].Position_id,
							project_id: projectIdList[i].Project_id,
						})
						.getOne();
					//console.log(pp);
					const pc = await PCProjectCandidate.createQueryBuilder('PCProjectCandidate')
						.where('PCProjectCandidate.Project_id = :pid')
						.andWhere('PCProjectCandidate.Position_id = :psid')
						.andWhere("PCProjectCandidate.Allowed = 'Allowed'")
						.setParameters({ pid: projectIdList[i].Project_id, psid: pp.Position_id })
						.getManyAndCount();
					//console.log('pc', pc);
					pc[0].forEach((p) => {
						const value = p.Owner.valueOf().toString();
						if (value === '1') {
							//console.log('value???', value);
							prjInfo.Owner = p.Candidate_id;
						}
					});
					//console.log(pc[0], pc[1]);
					prjInfo['StatusOfPosition'].push({
						Position_id: pp.Position_id,
						Position_name: pp.position.Position_name,
						TotalCount: pp.NoOfPosition,
						CurrenctCount: pc[1],
					});
				}
				projectList.push(prjInfo);
			}
			return projectList;
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
