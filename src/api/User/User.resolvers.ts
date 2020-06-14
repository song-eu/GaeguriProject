import * as bcrypt from 'bcryptjs';
//import { GraphQLServer } from 'graphql-yoga';
import { ResolverMap } from '../../types/graphql.utils';
import { User } from '../../entities/User';

export const resolvers: ResolverMap = {
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
			const user = User.create({
				Email: email,
				Password: hashedPwd,
			});

			await user.save();
			return null;
		},
	},
};
