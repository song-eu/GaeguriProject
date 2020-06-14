require('dotenv').config();
module.exports = {
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: 'gaeguri',
	synchronize: true,
	logging: true,
	entities: ['src/entities/**/*.ts'],
	migrations: ['src/migration/**/*.ts'],
	subscribers: ['src/subscriber/**/*.ts'],
	cli: {
		entitiesDir: 'src/entities',
		migrationsDir: 'src/migration',
		subscribersDir: 'src/subscriber',
	},
};
