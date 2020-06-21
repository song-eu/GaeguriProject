import { ResolverMap } from '../../../types/graphql.utils';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';
import { User } from '../../../entities/User';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';
import { createQueryBuilder } from 'typeorm';
import { Position } from '../../../entities/Position';

export const resolvers: ResolverMap = {
	Mutation: {
		participateProject: async (_, { input }) => {
			console.log(input);
			const { User_id, Project_id, Position_id, Position_name } = input;

			let inPC = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
				.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
				.where({
					Project_id,
				})
				.andWhere('Candidate_id = :cid and Allowed = :allowed', { cid: User_id, allowed: 'Allowed' })
				.getOne();
			if (inPC) {
				return [
					{
						path: 'participateProject',
						message: 'Already Participate',
					},
				];
			}

			let newPC = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
				.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
				.where({
					Project_id,
					Position_id,
				})
				.getOne();

			console.log('newPCU', newPC);
			//console.log('newPCU.PP_id', newPC.PP_id);

			if (!newPC) {
				return [
					{
						path: 'participateProject',
						message: 'Invalid Position',
					},
				];
			}
			for await (let prop of newPC.PC) {
				if (prop.Candidate_id === User_id) {
					if (prop.Sender_id !== null && prop.Allowed === 'Wait') {
						const invitedCandidate = await PCProjectCandidate.findOne({
							where: {
								Project_Postion_id: newPC.PP_id,
								Candidate_id: User_id,
							},
						});
						invitedCandidate.Allowed = 'Allowed';
						await invitedCandidate.save();
						return [
							{
								path: 'participateProject',
								message: 'Invited Accept',
							},
						];
					} else if (prop.Allowed === 'Wait') {
						return [
							{
								path: 'participateProject',
								message: 'Already requested',
							},
						];
					} else {
						const invitedCandidate = await PCProjectCandidate.findOne({
							where: {
								Project_Postion_id: newPC.PP_id,
								Candidate_id: User_id,
							},
						});
						invitedCandidate.Allowed = 'Wait';
						await invitedCandidate.save();
						return [
							{
								path: 'participateProject',
								message: 'Paricipation Requested Successfully',
							},
						];
					}
				}
			}
			const newPCU = await PCProjectCandidate.create({
				Project_Postion_id: newPC.PP_id,
				Candidate_id: User_id,
				Allowed: 'Wait',
			}).save();
			console.log(newPCU);
			return [
				{
					path: 'participateProject',
					message: 'Paricipation Requested Successfully',
				},
			];
		},
	},
};
