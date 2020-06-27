import { getConnectionOptions, createConnection, Like } from 'typeorm';

export const typeormdbc = async () => {
	const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
	await createConnection({ ...connectionOptions, name: 'default' });
};

export default typeormdbc;
