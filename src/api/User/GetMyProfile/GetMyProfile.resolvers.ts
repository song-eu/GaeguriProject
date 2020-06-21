import { ResolverMap, privateResolver } from '../../../types/graphql.utils';
import { User } from '../../../entities/User';
import { Position } from '../../../entities/Position';

/**
 *  const houses = await getRepository(House)
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.amenity', 'amenity')
      .leftJoinAndSelect('house.images', 'image')
      .where('house.plan = :plan', { plan: plan })
      .andWhere('house.type = :type', { type: type })
      .andWhere('house.year = :year', { year: year })
      .andWhere('house.access = :access', { access: access })
      .andWhere('house.adminDistrict = :adminDistrict', {
        adminDistrict: adminDistrict,
      })
      .getMany();
 */

export const resolvers: ResolverMap = {
	Query: {
		GetMyProfile: privateResolver(async (_, __, { req }) => {
			const { User_id } = req.user;
			const user = await User.createQueryBuilder('User')
				.leftJoinAndSelect('User.userstack', 'US')
				.leftJoinAndSelect('User.position', 'UP')
				.leftJoin('US.stack', 'Stack')
				.addSelect('Stack.Stack_name')
				.where({ User_id })
				.getMany();

			return {
				ok: true,
				error: null,
				user,
			};
		}),
	},
};
