import * as bcrypt from 'bcryptjs';

import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import createJWT from '../../../utils/token/createJWT';

export const resolvers: ResolverMap = {
	Mutation: {
		EmailLogin: async (_, args: GQL.EmailLoginMutationArgs): Promise<GQL.EmailLoginResponse> => {
			const { Email, Password } = args;
			try {
				const user = await User.findOne({ Email });
				if (!user) {
					return {
						ok: false,
						error: '유효하지 않은 사용자입니다',
						token: null,
					};
				}
				const isValid = await bcrypt.compareSync(Password, user.Password);
				console.log('isValid  ?', isValid);
				if (isValid) {
					const token = createJWT(user.User_id);
					return {
						ok: true,
						error: null,
						token,
					};
				} else {
					return {
						ok: false,
						error: '비밀번호가 올바르지 않습니다',
						token: null,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					token: null,
				};
			}
		},
	},
};
