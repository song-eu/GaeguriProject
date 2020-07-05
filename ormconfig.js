require('dotenv').config();
const path = require('path');
module.exports = {
	type: 'mysql',
	host: process.env.MYSQL_SERVER,
	port: 3306,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: true,
	entities: [path.join(__dirname, 'src/entities/**/*.ts')],
	migrations: [path.join(__dirname, 'src/migration/**/*.ts')],
	subscribers: [path.join(__dirname, 'src/subscriber/**/*.ts')],
	seeds: [path.join(__dirname, 'src/seed/seed/*.seed.ts')],
	factories: [path.join(__dirname, 'src/seed/factory/*.factory.ts')],
	cli: {
		entitiesDir: path.join(__dirname, 'src/entities'),
		migrationsDir: path.join(__dirname, 'src/migration'),
		subscribersDir: path.join(__dirname, 'src/subscriber'),
	},
};
