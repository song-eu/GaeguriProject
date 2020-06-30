require('dotenv').config();
module.exports = {
	type: 'mysql',
	host: process.env.MYSQL_SERVER,
	port: 3306,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: true,
	entities: ['src/entities/**/*.ts'],
	migrations: ['src/migration/**/*.ts'],
	subscribers: ['src/subscriber/**/*.ts'],
	seeds: ['src/seed/seed/*.seed.ts'],
	factories: ['src/seed/factory/*.factory.ts'],
	cli: {
		entitiesDir: 'src/entities',
		migrationsDir: 'src/migration',
		subscribersDir: 'src/subscriber',
	},
};
