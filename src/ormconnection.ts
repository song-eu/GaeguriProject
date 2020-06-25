import { getConnectionOptions, createConnection, Like } from 'typeorm';
import { User } from './entities/User';
//import { User } from './entities/User';

export const typeormdbc = async () => {
	const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
	await createConnection({ ...connectionOptions, name: 'default' });

	/* 
	const keyword = 'B';
	const users = await User.find({
		where: { Username: Like(`%${keyword}#%`) },
		join: {
			alias: 'user',
			leftJoinAndSelect: {
				UserStack: 'user.userstack',
				Position: 'user.position',
			},
			leftJoin: { Stack: 'UserStack.stack' },
		},
	});
	console.log('uuuuuuuuusers', users); */
};

export default typeormdbc;
