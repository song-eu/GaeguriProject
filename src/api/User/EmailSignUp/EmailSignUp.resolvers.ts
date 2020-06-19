import * as bcrypt from 'bcrypt';

import { ResolverMap } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import createJWT from '../../../utils/token/createJWT';

const BCRYPT_ROUND = 10;

export const resolvers: ResolverMap = {
	Mutation: {
		EmailSignUp: async (_, args: GQL.EmailSignUpMutationArgs) => {
			console.log('args?', args);
			const existingUser = await User.findOne({ Email: args.Email });
			if (existingUser) {
				return {
					ok: false,
					error: '이미 존재하는 이메일 입니다',
					token: null,
				};
			} else {
				const hashedPwd = await bcrypt.hash(args.Password, BCRYPT_ROUND);
				const newUser = await User.create({ ...args, Password: hashedPwd }).save();
				const token = createJWT(newUser.User_id);
				return {
					ok: true,
					error: null,
					token,
				};
			}
		},
	},
};
