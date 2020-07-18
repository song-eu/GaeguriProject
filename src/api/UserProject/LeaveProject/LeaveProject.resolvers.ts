import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';

export const resolvers: ResolverMap = {
	Mutation: {
		leaveProject: privateResolver(async (_, { input }, { req, pubSub }) => {
			console.log(input);
			const { Project_id, Position_id } = input;
			const { User_id } = req.user;
			const attendUser = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
				.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
				.where({
					Project_id,
					Position_id,
				})
				.andWhere('Candidate_id = :uid ', { uid: User_id })
				.getOne();
			console.log(attendUser);

			const prj = await Project.createQueryBuilder('Project')
				.leftJoinAndSelect('Project.projectpositionno', 'pno')
				.leftJoinAndSelect('pno.PC', 'PC')
				.where({ Project_id })
				.andWhere('PC.Allowed = :allowed', { allowed: 'Allowed' })
				.getOne();

			if (attendUser) {
				if (prj.Owner_id === User_id) {
					console.log(prj);
					console.log(prj.projectpositionno[0].PC);
					var projectUserList = [];
					for await (let projectUser of prj.projectpositionno) {
						projectUser.PC.forEach((user) => {
							if (user.Candidate_id !== User_id) {
								projectUserList.push(user.Candidate_id);
							}
						});
					}
					prj.Owner_id = projectUserList[0];
					await prj.save();
				}
				if (attendUser.PC[0].Allowed === 'Allowed') {
					attendUser.PC[0].Allowed = 'Leaved';
					await attendUser.PC[0].save();
					return [
						{
							path: 'leaveProject',
							message: 'Success',
						},
					];
				} else if (attendUser.PC[0].Allowed === 'Wait' && attendUser.PC[0].Sender_id != null) {
					attendUser.PC[0].Allowed = 'Rejected';
					await attendUser.PC[0].save();
					return [
						{
							path: 'rejectProject',
							message: 'Success',
						},
					];
				} else {
					return [
						{
							path: 'leaveProject',
							message: 'Unvaild User',
						},
					];
				}
			} else {
				return [
					{
						path: 'leaveProject',
						message: 'Unvaild User',
					},
				];
			}
		}),
	},
};
