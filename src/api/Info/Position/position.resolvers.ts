import { ResolverMap } from '../../../types/graphql.utils';
import { Position } from '../../../entities/Position';
import { In } from 'typeorm';

export const resolvers: ResolverMap = {
	Query: {
		positionAll: async (_, __) => {
			const position = await Position.find();
			console.log(position);
			return position;
		},
		positionUser: async (_, __) => {
			const position = await Position.find({
				where: { Position_name: In(['Front-end', 'Back-end', 'Fullstack']) },
			});
			console.log(position);
			return position;
		},
	},
};
