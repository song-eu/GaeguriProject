import * as bcrypt from 'bcrypt';
import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import trimArgs from '../../../utils/trimArgs';
import { Position } from '../../../entities/Position';
import { USUserStack } from '../../../entities/US_UserStack';
import { Stack } from '../../../entities/Stack';
const BCRYPT_ROUND = 10;

export const resolvers: ResolverMap = {
	Mutation: {
		UpdateMyProfile: privateResolver(async (_, args: GQL.UpdateMyProfileMutationArgs, { req }) => {
			const { User_id } = req.user;
			let userPosition: Position;
			let userStack: Array<Stack> = [];
			try {
				if ('Password' in args) {
					const user = await User.findOne(User_id);
					user.Password = args.Password;
					await User.save(user);
				}
				if ('position' in args) {
					const position = await Position.findOne({ where: { Position_name: args.position } });
					args.Position_id = position.Position_id;
					userPosition = position;
					delete args.position;
				}
				if ('stack' in args) {
					await USUserStack.delete({ User_id });
					args.stack.forEach(async (st) => {
						let newStack = await Stack.findOne({ where: { Stack_name: st } });
						if (!newStack) {
							newStack = await Stack.create({ Stack_name: st }).save();
						}
						userStack.push(newStack);
						await USUserStack.create({ User_id, Stack_id: newStack.Stack_id }).save();
					});

					delete args.stack;
				}

				delete args.Password;
				const notNull: any = trimArgs(args);
				await User.update({ User_id }, { ...notNull });
				const user = User.findOne({ User_id });
				return {
					ok: true,
					error: null,
					user,
					position: userPosition,
					stack: userStack,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					user: null,
					position: null,
					stack: null,
				};
			}
		}),
	},
};
