import { privateResolver, ResolverMap } from '../../../types/graphql.utils';
import { UFUserFriend } from '../../../entities/UF_UserFriend';

export const resolvers: ResolverMap = {
	Query: {
		GetFollowList: privateResolver(async (_, __, { req }) => {
			const { User_id } = req.user;
			try {
				const followers = await UFUserFriend.createQueryBuilder('UF')
					.leftJoinAndSelect('UF.followee', 'UFEE')
					.where({ Follower_id: User_id })
					.getMany();
				const followees = await UFUserFriend.createQueryBuilder('UF')
					.leftJoinAndSelect('UF.follower', 'UFER')
					.where({ Followee_id: User_id })
					.getMany();

				return {
					ok: true,
					error: null,
					followers,
					followees,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					followers: null,
					followees: null,
				};
			}
		}),
	},
	Mutation: {
		// follow, unfollow
		ToggleFollow: privateResolver(async (_, args: GQL.ToggleFollowMutationArgs, { req }) => {
			const Follower_id = req.user.User_id;
			const Followee_id = args.User_id;
			try {
				const isFollowed = await UFUserFriend.findOne({ Follower_id, Followee_id });
				isFollowed
					? await UFUserFriend.delete({ Follower_id, Followee_id })
					: await UFUserFriend.create({ Follower_id, Followee_id }).save();
				return {
					ok: true,
					error: null,
					path: 'toggleFollow',
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					path: 'toggleFollow',
				};
			}
		}),
	},
};
