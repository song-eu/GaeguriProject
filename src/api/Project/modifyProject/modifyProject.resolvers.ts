import { ResolverMap } from '../../../types/graphql.utils';
import { getConnection, createQueryBuilder } from 'typeorm';
import { Project } from '../../../entities/Project';

export const resolvers: ResolverMap = {
	Mutation: {
		updateProjectInfo: async (_, { input }) => {
			console.log(input);
			const ps = await getConnection()
				.createQueryBuilder()
				.from(Project, 'Project')
				.relation(Project, 'projectstack')
				.of(input.Project_id)
				.loadMany();
			//console.log('ps???????', ps);

			if (input.Project_name) {
				//console.log('prjectname 변경');
				await createQueryBuilder()
					.update('Project')
					.set({ Project_name: input.Project_name })
					.where({
						Project_id: input.Project_id,
					})
					.execute();
			}
			if (input.Project_EndAt) {
				await createQueryBuilder()
					.update('Project')
					.set({ EndAt: input.Project_EndAt })
					.where({
						Project_id: input.Project_id,
					})
					.execute();
			}
			if (input.Project_Desc) {
				await createQueryBuilder()
					.update('Project')
					.set({ Desc: input.Project_Desc })
					.where({
						Project_id: input.Project_id,
					})
					.execute();
			}
		},
		updateProjectStack: (_, { input }) => {
			console.log(input);
		},
		updateProjectNoOfPosition: (_, { input }) => {
			console.log(input);
		},
		updateProjectStatus: (_, { input }) => {
			console.log(input);
		},
	},
};
