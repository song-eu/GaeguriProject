import 'reflect-metadata';
import { Options } from 'graphql-yoga';
import app from './app';

import 'dotenv/config';

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';
const appOptions: Options = {
	port: PORT,
	playground: PLAYGROUND_ENDPOINT,
	endpoint: GRAPHQL_ENDPOINT,
};

app.start(appOptions, () => console.log(`Server is running on localhost:${PORT}`));
