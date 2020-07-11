import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import { Project } from '../../../entities/Project';
import { PCProjectCandidate } from '../../../entities/PC_ProjectCandidate';

export const resolvers: ResolverMap = {
	Query: {
		getInvitableUserList: privateResolver(async (_, { input }, { req, pubSub }) => {
			const { Project_id, Position_id } = input;
			//console.log('req??????', Project_id);
			//console.log('req', req.user.User_id);
			/*  Project list 참여한 유저나, 초대한 유저를 제외한 
                const prjInfo = await Project.createQueryBuilder('Project')
				.leftJoinAndSelect('Project.projectpositionno', 'PO')
				.leftJoinAndSelect('PO.PC', 'PC')
				.andWhere('Project.Project_id = :pid and PC.Allowed IN (:...status)', { status: ['Allowed', 'Rejected'] })
				.orWhere('Project.Project_id = :pid and PC.Allowed = :wait and PC.Sender_id IS NOT NULL', { wait: 'Wait' })
				.setParameter('pid', Project_id)
				.getMany(); */
			try {
				const includeUser = await PCProjectCandidate.createQueryBuilder('PCProjectCandidate')
					.leftJoinAndSelect('PCProjectCandidate.PP', 'PP')
					.leftJoinAndSelect('PP.project', 'PRJ')
					.andWhere('PRJ.Project_id = :pid and PCProjectCandidate.Allowed IN (:...status)')
					.orWhere(
						'PRJ.Project_id = :pid and PCProjectCandidate.Allowed = :wait and PCProjectCandidate.Sender_id IS NOT NULL'
					)
					.select('Candidate_id');
				let availableUser;
				if (Position_id === undefined) {
					availableUser = await User.createQueryBuilder('User')
						.where('User_id NOT IN (' + includeUser.getQuery() + ')')
						.setParameter('pid', Project_id)
						.setParameter('status', ['Allowed', 'Rejected'])
						.setParameter('wait', 'Wait')
						.getMany();
				} else {
					availableUser = await User.createQueryBuilder('User')
						.where({ Position_id })
						.andWhere('User_id NOT IN (' + includeUser.getQuery() + ')')
						.setParameter('pid', Project_id)
						.setParameter('status', ['Allowed', 'Rejected'])
						.setParameter('wait', 'Wait')
						.getMany();
				}

				console.log(availableUser);
				return {
					ok: true,
					error: null,
					user: availableUser,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					user: null,
				};
			}
			// subquery 로 includeUser 를 웨어절에서 제거하고 출력
			// position_id 를 추가해서 user 의 포지션별로 출력 가능하게
			// if 절 왜에 쓸 수 있는 방법은? 있으면 검색 없으면 검색안하는.. ?
		}),
	},
};
