import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';

export const resolvers: ResolverMap = {
	Mutation: {
		sendInvitation: privateResolver(async (_, { input }, { req, pubSub }) => {
			const { Candidate_id, Project_id, Position_id } = input;
			const Sender_id = req.user.User_id;
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
				pubSub.publish('SEND_INVITATION', {
					invitationSub: {
						Project_id,
						Position_id,
						Candidate_id,
						Sender_id,
					},
				});
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
		}),
	},
};
