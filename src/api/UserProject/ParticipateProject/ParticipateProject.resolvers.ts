import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';
import { User } from '../../../entities/User';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';
import { createQueryBuilder } from 'typeorm';
import { Position } from '../../../entities/Position';

export const resolvers: ResolverMap = {
	Mutation: {
		participateProject: privateResolver(async (_, { input }, { req, pubSub }) => {
			//console.log(input);
			const { Project_id, Position_id, Answer } = input;
			const { User_id } = req.user;
			try {
				let inPC = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
					.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
					.where({
						Project_id,
					})
					.andWhere('Candidate_id = :cid and Allowed = :allowed', { cid: User_id, allowed: 'Allowed' })
					.getOne();
				if (inPC) {
					return {
						ok: false,
						path: 'participateProject',
						error: 'Already Participate',
					};
				}

				let newPC = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
					.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
					.where({
						Project_id,
						Position_id,
					})
					.getOne();

				//console.log('newPCU', newPC);
				//console.log('newPCU.PP_id', newPC.PP_id);

				if (!newPC) {
					return {
						ok: false,
						path: 'participateProject',
						error: 'Invalid Position',
					};
				}
				for await (let prop of newPC.PC) {
					if (prop.Candidate_id === User_id) {
						if (prop.Sender_id !== null && prop.Allowed === 'Wait') {
							const [parti, partiTotal] = await PCProjectCandidate.findAndCount({
								where: {
									Project_Postion_id: newPC.PP_id,
									Allowed: 'Allowed',
								},
							});
							//console.log('partitotal vs noof position ', partiTotal, newPC.NoOfPosition);
							if (partiTotal >= newPC.NoOfPosition) {
								return {
									ok: false,
									error: 'Capacity exceeded',
									patha: 'participateProject',
								};
							}
							const invitedCandidate = await PCProjectCandidate.findOne({
								where: {
									Project_Postion_id: newPC.PP_id,
									Candidate_id: User_id,
								},
							});
							invitedCandidate.Allowed = 'Allowed';
							await invitedCandidate.save();
							pubSub.publish('ACCEPT_INVITATION', {
								acceptInvitationSub: { Project_id, Position_id, User_id, Sender: invitedCandidate.Sender_id },
							});
							return {
								ok: true,
								path: 'participateProject - Invited Accept',
								error: null,
							};
						} else {
							const [parti, partiTotal] = await PCProjectCandidate.findAndCount({
								where: {
									Project_Postion_id: newPC.PP_id,
									Allowed: 'Allowed',
								},
							});
							if (partiTotal >= newPC.NoOfPosition) {
								return {
									ok: false,
									error: 'Capacity exceeded',
									patha: 'participateProject',
								};
							}
							//console.log('partitotal vs noof position ', partiTotal, newPC.NoOfPosition);

							const invitedCandidate = await PCProjectCandidate.findOne({
								where: {
									Project_Postion_id: newPC.PP_id,
									Candidate_id: User_id,
								},
							});
							invitedCandidate.Answer = Answer;
							invitedCandidate.Allowed = 'Allowed';
							await invitedCandidate.save();
							pubSub.publish('NEW_PARTICIPATION_APPLY', {
								newApplySub: { Project_id, Position_id, User_id },
							});
							return {
								ok: true,
								path: 'participateProject - Participate Successfully',
								error: null,
							};
						}
					}
				}
				const [parti, partiTotal] = await PCProjectCandidate.findAndCount({
					where: {
						Project_Postion_id: newPC.PP_id,
						Allowed: 'Allowed',
					},
				});
				if (partiTotal >= newPC.NoOfPosition) {
					return {
						ok: false,
						error: 'Capacity exceeded',
						patha: 'participateProject',
					};
				}
				//console.log('partitotal vs noof position ', partiTotal, newPC.NoOfPosition);

				const newPCU = await PCProjectCandidate.create({
					Project_Postion_id: newPC.PP_id,
					Candidate_id: User_id,
					Allowed: 'Allowed',
					Answer: Answer,
				}).save();
				//console.log(newPCU);
				pubSub.publish('NEW_PARTICIPATION_APPLY', { newApplySub: { Project_id, Position_id, User_id } });
				return {
					ok: true,
					path: 'participateProject - Participate Successfully',
					error: null,
				};
			} catch (e) {
				return {
					ok: false,
					path: 'participateProject',
					error: e.message,
				};
			}
		}),
	},
};
