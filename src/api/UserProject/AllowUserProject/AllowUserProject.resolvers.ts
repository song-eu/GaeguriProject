import { ResolverMap } from '../../../types/graphql.utils';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';

export const resolvers: ResolverMap = {
	Mutation: {
		allowUserProject: async (_, { input }) => {
			//console.log(input);
			const { User_id, Project_id, Position_id, Allowed } = input;
			let candidate = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
				.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
				.where({ Project_id, Position_id })
				.andWhere('PC.Candidate_id = :uid', { uid: User_id })
				.getOne();

			console.log(candidate);
			if (candidate.PC[0].Allowed === 'Allowed') {
				return [
					{
						path: 'allowUserProject',
						message: 'Alredy Allowed User',
					},
				];
			} else {
				candidate.PC[0].Allowed = Allowed;
				await candidate.PC[0].save();
				return [
					{
						path: 'allowUserProject',
						message: `User ${Allowed}`,
					},
				];
			}
		},
	},
};
