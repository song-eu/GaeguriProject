import * as bcrypt from 'bcryptjs';
//import { GraphQLServer } from 'graphql-yoga';
import { ResolverMap } from '../../types/graphql.utils';
import { User } from '../../entity/User';

export const resolvers: ResolverMap = {
	Query: {
		login: async (_, { Email, Password }) => {
			console.log('login password??', Password);
			const userLogin = await User.findOne({
				where: { Email },
				select: ['User_id', 'Username', 'Password'],
			});
			if (userLogin) {
				const hashedPwd = await bcrypt.compareSync(Password, userLogin.Password);
				if (hashedPwd) {
					// passport session 관련 코드
					return [
						{
							path: 'Login',
							message: 'Login Success',
						},
					];
				} else {
					return [
						{
							path: 'Login',
							message: 'Password fail',
						},
					];
				}
			} else {
				return [
					{
						path: 'Login',
						message: 'Unvalid Email',
					},
				];
			}
		},
	},
	Mutation: {
		register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
			const userAlreadyExists = await User.findOne({
				where: { Email: email },
				select: ['User_id'],
			});
			if (userAlreadyExists) {
				return [
					{
						path: 'email',
						message: 'already taken',
					},
				];
			}
			const hashedPwd = await bcrypt.hash(password, 10);
			console.log('signup password', password, hashedPwd);
			const user = User.create({
				Email: email,
				Password: hashedPwd,
			});

			await user.save();
			return null;
		},
	},
};
