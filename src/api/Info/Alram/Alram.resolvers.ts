import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { createQueryBuilder } from 'typeorm';
import moment from 'moment';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';

export const resolvers: ResolverMap = {
	Query: {
		test: (parent, args, context, info) => {
			return true;
		},
		myAlramList: privateResolver(async (_, args, { req, pubSub }) => {
			const { User_id } = req.user;
			//10 일 이내 참여자 알람 리스트
			try {
				//const User_id = 10;
				const after = moment().subtract(10, 'days').format('YYYY-MM-DD');
				const newMem = await createQueryBuilder('PCProjectCandidate', 'PC')
					.leftJoinAndSelect('PC.sender', 'PS')
					.leftJoinAndSelect('PC.candidate', 'PU')
					.leftJoinAndSelect('PC.PP', 'PP')
					.leftJoinAndSelect('PP.position', 'PO')
					.leftJoinAndSelect('PP.project', 'P')
					.where('PC.createdAt >= :after', { after })
					.andWhere('PC.Allowed = :allowed', { allowed: 'Allowed' })
					.andWhere('PC.Candidate_id != :uid', { uid: User_id })
					.andWhere('P.Owner_id = :uid', { uid: User_id })
					.getRawMany();
				//console.log(newMem);
				let newMemData = [];
				for await (let data of newMem) {
					//console.log(data);
					let newMem = {
						type: 'NewMember',
						Project_id: data.P_Project_id,
						Project_name: data.P_Project_name,
						Position_id: data.PP_Position_id,
						Position_name: data.PO_Position_name,
						User_id: data.PC_Candidate_id,
						Email: data.PU_Email,
						Username: data.PU_Username,
						createAt: data.PC_createdAt,
					};
					newMemData.push(newMem);
				}

				const newInvite = await createQueryBuilder('PCProjectCandidate', 'PC')
					.leftJoinAndSelect('PC.sender', 'PU')
					.leftJoinAndSelect('PC.PP', 'PP')
					.leftJoinAndSelect('PP.position', 'PO')
					.leftJoinAndSelect('PP.project', 'P')
					.where('PC.Sender_id IS NOT NULL')
					.andWhere('PC.Allowed = :allowed', { allowed: 'Wait' })
					.andWhere('PC.Candidate_id = :uid', { uid: User_id })
					.getRawMany();

				let newInvitationData = [];
				for await (let data of newInvite) {
					//console.log(data);
					let newInv = {
						type: 'New Invitation',
						Project_id: data.P_Project_id,
						Project_name: data.P_Project_name,
						Position_id: data.PP_Position_id,
						Position_name: data.PO_Position_name,
						User_id: data.PC_Sender_id,
						Email: data.PU_Email,
						Username: data.PU_Username,
						createAt: data.PC_createdAt,
					};
					newInvitationData.push(newInv);
				}

				//console.log('newMem-----------------------', newMemData, newInvitationData);

				return {
					ok: true,
					path: 'myAlramList',
					error: null,
					newMember: newMemData,
					newInvitation: newInvitationData,
				};
			} catch (error) {
				return {
					ok: false,
					path: 'myAlramList',
					error: error.message,
					newMember: null,
					newInvitation: null,
				};
			}
		}),
	},
};

// 방장에게 ~ 님이 참여하셨습니다.
// 나에게 .. 프로젝트 방에서 ~ 님이 초대하셨습니다.

// User_id 가있다면 Owner_id === User_id 의 참여자 알람
// Sender_id 있고 Candidate_id === User_id 이고, 참여상태가 await 인것만 알람리스트에
// 나머지 상태는 거절하거나 참여된 것이므로
//type = project 방에 참여자 있다는 알람인지, 초대 알람인지 구분
// ==> 'New Member in Project' / 'Invitation'
// 지난 1주일간의 New Member 이면, project_id, project_name , 참여한 user_id, email, username + 참여 포지션
// 초대는 수락/거절 할때까지 리스팅
// 초대라면 project 정보, + 보낸사람 user_정보 + 초대 포지션
