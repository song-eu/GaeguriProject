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
			try {
				/* if ('Password' in args) {
					const hashedPwd = await bcrypt.hash(args.Password, BCRYPT_ROUND);
					args.Password = hashedPwd;
				} */
				if ('position' in args) {
					const position = await Position.findOne({ where: { Position_name: args.position } });
					args.Position_id = position.Position_id;
					delete args.position;
				}
				if ('stack' in args) {
					await USUserStack.delete({ User_id });
					args.stack.forEach(async (st) => {
						let newStack = await Stack.findOne({ where: { Stack_name: st } });
						if (!newStack) {
							newStack = await Stack.create({ Stack_name: st }).save();
						}
						await USUserStack.create({ User_id, Stack_id: newStack.Stack_id }).save();
					});
					delete args.stack;
				}
				const notNull: any = trimArgs(args);
				const user = await User.update({ User_id }, { ...notNull });
				return {
					ok: true,
					error: null,
					user,
				};
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					user: null,
				};
			}
		}),
	},
};
