import { getConnectionOptions, createConnection } from 'typeorm';
//import { User } from './entities/User';

export const typeormdbc = async () => {
	const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
	return createConnection({ ...connectionOptions, name: 'default' });
};

export default typeormdbc;
