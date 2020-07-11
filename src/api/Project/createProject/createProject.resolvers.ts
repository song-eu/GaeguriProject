import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';
import { Position } from '../../../entities/Position';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';
import { PSProjectStack } from '../../../entities/PS_ProjectStack';
import { Stack } from '../../../entities/Stack';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';

export const resolvers: ResolverMap = {
	Mutation: {
		createNewProject: privateResolver(
			async (_, { Project_name, StartAt, EndAt, Desc, NoOfPosition, Stacks, Question }, { req, pubSub }) => {
				//console.log('NoOfPosition??', NoOfPosition);
				const User_id = req.user.User_id;
				try {
					const newProject = new Project();
					newProject.Project_name = Project_name;
					newProject.StartAt = StartAt;
					newProject.EndAt = EndAt;
					newProject.Desc = Desc;
					newProject.createdBy = User_id;
					newProject.Owner_id = User_id;
					newProject.Question = Question;
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
					await Stacks.forEach(async (st) => {
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
					console.log(newProject);
					const project = await Project.createQueryBuilder('Project')
						.leftJoinAndSelect('Project.projectpositionno', 'ppn')
						.leftJoinAndSelect('Project.projectstack', 'ps')
						.leftJoin('ps.stack', 'stack')
						.leftJoin('ppn.position', 'position')
						.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
						.leftJoin('PC.candidate', 'PCU')
						.where('Project.Project_id = :Project_id')
						.setParameter('Project_id', newProject.Project_id)
						.addSelect('stack.Stack_name')
						.addSelect('position.Position_name')
						.addSelect('PC')
						.addSelect('PCU')
						.getOne();

					return {
						ok: true,
						error: null,
						path: 'createNewProject',
						newProject: project,
					};
				} catch (error) {
					return {
						ok: false,
						error: null,
						path: 'createNewProject',
						newProject: null,
					};
				}
			}
		),
	},
};
