import { ResolverMap } from '../../../types/graphql.utils';
import { Project } from '../../../entities/Project';

export const resolvers: ResolverMap = {
	Query: {
		searchProject: async (_, { input }) => {
			const { category, keyword } = input;
			try {
				if (category === undefined) {
					const project = await Project.createQueryBuilder('Project')
						.leftJoinAndSelect('Project.projectpositionno', 'ppn')
						.leftJoinAndSelect('Project.projectstack', 'ps')
						.leftJoin('ps.stack', 'stack')
						.leftJoin('ppn.position', 'position')
						.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed')
						.leftJoin('PC.candidate', 'PCU')
						.where('Project.Project_name like :keyword')
						.orWhere('Project.Desc like :keyword')
						.orWhere('stack.Stack_name like :keyword')
						.orWhere('position.Position_name like :keyword')
						.setParameter('allowed', 'Allowed')
						.setParameter('keyword', `%${keyword}%`)
						.addSelect('stack')
						.addSelect('position')
						.addSelect('PC')
						.addSelect('PCU')
						.getMany();

					console.log(project);
					return {
						ok: true,
						error: null,
						filteredPrj: project,
					};
				} else {
					let cat = category;
					if (category.includes('Project') || category.includes('Desc') || category.includes('status')) {
						cat = 'Project.' + category;
					} else if (category.includes('Stack')) {
						cat = 'stack.' + category;
					} else if (category.includes('Position')) {
						cat = 'position.' + category;
					}
					const projectwithcategory = await Project.createQueryBuilder('Project')
						.leftJoinAndSelect('Project.projectpositionno', 'ppn')
						.leftJoinAndSelect('Project.projectstack', 'ps')
						.leftJoin('ps.stack', 'stack')
						.leftJoin('ppn.position', 'position')
						.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed')
						.leftJoin('PC.candidate', 'PCU')
						.where(`${cat} like :keyword`)
						.setParameter('allowed', 'Allowed')
						.setParameter('keyword', `%${keyword}%`)
						.addSelect('stack')
						.addSelect('position')
						.addSelect('PC')
						.addSelect('PCU')
						.getMany();

					return {
						ok: true,
						error: null,
						filteredPrj: projectwithcategory,
					};
				}
			} catch (error) {
				return {
					ok: false,
					error: error.message,
					filteredPrj: null,
				};
			}
		},
	},
};
