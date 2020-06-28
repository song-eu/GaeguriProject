import { ResolverMap } from '../../../types/graphql.utils';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';

export const resolvers: ResolverMap = {
	Mutation: {
		sendInvitation: async (_, { input }) => {
			const { Sender_id, Candidate_id, Project_id, Position_id } = input;
			try {
				const pp = await PPProjectPositionNo.findOne({
					where: { Project_id, Position_id },
				});
				//console.log(pp);
				const newPC = new PCProjectCandidate();
				newPC.Project_Postion_id = pp.PP_id;
				newPC.Sender_id = Sender_id;
				newPC.Candidate_id = Candidate_id;
				newPC.Allowed = 'Wait';
				await newPC.save();

				console.log(newPC);

				return {
					ok: true,
					error: null,
					path: 'sendInvitation',
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					path: 'sendInvitation',
				};
			}
		},
	},
};
