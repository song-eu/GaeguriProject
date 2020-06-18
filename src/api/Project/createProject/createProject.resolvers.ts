import { ResolverMap } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';
import { Position } from '../../../entities/Position';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';
import { PSProjectStack } from '../../../entities/PS_ProjectStack';
import { Stack } from '../../../entities/Stack';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';

export const resolvers: ResolverMap = {
	Mutation: {
		createNewProject: async (_, { Project_name, StartAt, EndAt, Desc, NoOfPosition, User_id, Stacks }) => {
			//console.log('NoOfPosition??', NoOfPosition);
			const newProject = new Project();
			newProject.Project_name = Project_name;
			newProject.StartAt = StartAt;
			newProject.EndAt = EndAt;
			newProject.Desc = Desc;
			newProject.createdBy = User_id;
			newProject.Owner_id = User_id;
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
			return null;
		},
	},
};
