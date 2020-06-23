import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../entities/User';
import faker from 'faker';
import { USUserStack } from '../../entities/US_UserStack';
import { Position } from '../../entities/Position';
import { Stack } from '../../entities/Stack';
import { Project } from '../../entities/Project';
import { PPProjectPositionNo } from '../../entities/PP_ProjectPositionNo';
import { PCProjectCandidate } from '../../entities/PC_ProjectCandidate';

export default class CreateDummy implements Seeder {
	public async run(factory: Factory, connection: Connection): Promise<any> {
		await connection
			.createQueryBuilder()
			.insert()
			.into(Position)
			.values([{ Position_name: 'Front-end' }, { Position_name: 'Back-end' }, { Position_name: 'Fullstack' }])
			.execute();

		await connection
			.createQueryBuilder()
			.insert()
			.into(Stack)
			.values([
				{ Stack_name: 'Database' },
				{ Stack_name: 'Java' },
				{ Stack_name: 'PHP' },
				{ Stack_name: 'Angular' },
				{ Stack_name: 'Veu' },
				{ Stack_name: 'PostgreSQL' },
				{ Stack_name: 'SQL' },
				{ Stack_name: 'MongoDB' },
				{ Stack_name: 'No-SQL' },
				{ Stack_name: 'C/C++' },
				{ Stack_name: 'Dev-ops' },
				{ Stack_name: 'Cloud' },
				{ Stack_name: 'AWS' },
				{ Stack_name: 'Redux-saga' },
				{ Stack_name: 'Redux' },
				{ Stack_name: 'React-Native' },
				{ Stack_name: 'React-hooks' },
				{ Stack_name: 'React' },
				{ Stack_name: 'GraphQl' },
				{ Stack_name: 'Apollo' },
				{ Stack_name: 'Mysql' },
				{ Stack_name: 'Machine Learning' },
				{ Stack_name: 'Python' },
				{ Stack_name: 'Javascript' },
				{ Stack_name: 'NodeJS' },
				{ Stack_name: 'UI/UX' },
				{ Stack_name: 'Styled Component' },
				{ Stack_name: 'Typescript' },
				{ Stack_name: 'Redis' },
				{ Stack_name: 'R' },
				{ Stack_name: 'JQuery' },
				{ Stack_name: 'Express' },
				{ Stack_name: 'TensorFlow' },
				{ Stack_name: 'Ruby' },
				{ Stack_name: 'Swift' },
				{ Stack_name: 'D3' },
				{ Stack_name: 'Django' },
				{ Stack_name: 'Flask' },
				{ Stack_name: 'Docker' },
				{ Stack_name: 'git' },
				{ Stack_name: 'Socket.I.O.' },
			])
			.execute();
		let user_id = 1;
		const newUsers = await factory(User)().createMany(10);
		for await (let user of newUsers) {
			const min = faker.random.number({ min: 1, max: 30 });
			const max = faker.random.number({ min: 1, max: 30 });
			//console.log('USER_ID?????????', user);
			if (min > max) {
				for (let i = min; i <= max; i++) {
					const us = new USUserStack();
					us.User_id = user.User_id;
					us.Stack_id = i;
					await us.save();
				}
			} else {
				const us = new USUserStack();
				us.User_id = user.User_id;
				us.Stack_id = faker.random.number({ min: 1, max: 30 });
				await us.save();
			}
		}
		let prj_id = 1;
		const newPrjs = await factory(Project)().createMany(15);

		for await (let project of newPrjs) {
			const pp = new PPProjectPositionNo();
			pp.Project_id = project.Project_id;
			pp.Position_id = faker.random.number({ min: 1, max: 3 });
			pp.NoOfPosition = faker.random.number({ min: 2, max: 5 });
			await pp.save();

			const pc = new PCProjectCandidate();
			pc.Project_Postion_id = pp.PP_id;
			pc.Candidate_id = project.Owner_id;
			pc.Allowed = 'Allowed';
			await pc.save();

			const pp2 = new PPProjectPositionNo();
			pp2.Project_id = project.Project_id;
			pp2.Position_id = pp.Position_id === 3 ? pp.Position_id - 1 : pp.Position_id + 1;
			pp2.NoOfPosition = pp.NoOfPosition === 5 ? pp.NoOfPosition - 1 : pp.NoOfPosition + 1;
			await pp2.save();

			const pc2User = faker.random.number({ min: 1, max: 10 });
			if (pc2User !== project.Owner_id) {
				const pc2 = new PCProjectCandidate();
				pc2.Project_Postion_id = pp.PP_id;
				pc2.Candidate_id = pc2User;
				pc2.Allowed = 'Allowed';
				await pc2.save();
			}
		}
	}
}
