import { ResolverMap } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import createJWT from '../../../utils/token/createJWT';
import { Position } from '../../../entities/Position';
import { USUserStack } from '../../../entities/US_UserStack';
import { Stack } from '../../../entities/Stack';
import trimArgs from '../../../utils/trimArgs';

export const resolvers: ResolverMap = {
	Mutation: {
		EmailSignUp: async (_, args: GQL.EmailSignUpMutationArgs) => {
			const existingUser = await User.findOne({ Email: args.Email });
			if (existingUser) {
				return {
					ok: false,
					error: '이미 존재하는 이메일 입니다',
					token: null,
					user: existingUser,
				};
			} else {
				const { Email, Password, Username } = args;
				const newUser = await User.create({ Email, Password, Username }).save();
				const token = createJWT(newUser.User_id);

				if ('position' in args) {
					const position = await Position.findOne({ where: { Position_name: args.position } });
					args.Position_id = position.Position_id;
					delete args.position;
				}
				if ('stack' in args) {
					args.stack.forEach(async (st) => {
						let newStack = await Stack.findOne({ where: { Stack_name: st } });
						if (!newStack) {
							newStack = await Stack.create({ Stack_name: st }).save();
						}
						await USUserStack.create({ User_id: newUser.User_id, Stack_id: newStack.Stack_id }).save();
					});
					delete args.stack;
				}
				const notNull: any = trimArgs(args);
				const user = await User.update({ User_id: newUser.User_id }, { ...notNull });

				return {
					ok: true,
					error: null,
					token,
					user,
				};
			}
		},
	},
};
