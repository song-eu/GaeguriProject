import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import createJWT from '../../../utils/token/createJWT';

export const resolvers: ResolverMap = {
	Mutation: {
		KakaoLogin: async (_, args: GQL.SocialLoginMutationArgs) => {
			const { Kakao_id, Username, Profile_photo_path } = args;
			try {
				const user = await User.findOne({ Kakao_id });
				if (user) {
					const token = createJWT(user.User_id);
					return {
						ok: true,
						error: null,
						state: '로그인 성공',
						token,
						user,
					};
				} else {
					const newUser = await User.create({
						Kakao_id,
						Username,
						Profile_photo_path,
					}).save();
					const token = createJWT(newUser.User_id);
					return {
						ok: true,
						error: null,
						state: '회원가입이 완료되었습니다',
						token,
						user: newUser,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					state: '에러가 발생했습니다. 에러메세지를 참조해주세요',
					token: null,
					user: null,
				};
			}
		},
	},
};
