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
import { PSProjectStack } from '../../entities/PS_ProjectStack';
import { Chat } from '../../entities/Chat';
import * as bcrypt from 'bcrypt';
const BCRYPT_ROUND = 10;
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
		const newGaeguri = new User();
		newGaeguri.Email = 'gaeguri@gaeguri.com';
		newGaeguri.Username = '개구리';
		newGaeguri.Position_id = 1;
		newGaeguri.Password = await bcrypt.hash('test', BCRYPT_ROUND);
		newGaeguri.AboutMe = '개발자 구석에서 이제나와 코딩하자';
		await newGaeguri.save();
		const newUsers = await factory(User)().createMany(40);
		for await (let user of newUsers) {
			const sUser = await User.findOne({ User_id: user.User_id });
			sUser.Password = 'test';
			await sUser.save();
			const min = faker.random.number({ min: 1, max: 5 });
			const max = faker.random.number({ min: 1, max: 5 });
			let n = faker.random.number({ min: 1, max: 35 });
			//console.log('USER_ID?????????', user);
			if (min < max) {
				for (let i = min; i <= max; i++) {
					const us = new USUserStack();
					us.User_id = user.User_id;
					us.Stack_id = n++;
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
		const newPrjs = await factory(Project)().createMany(80);

		for await (let project of newPrjs) {
			const minps = faker.random.number({ min: 1, max: 5 });
			const maxps = faker.random.number({ min: 1, max: 5 });
			let m = faker.random.number({ min: 1, max: 35 });
			if (minps < maxps) {
				for (let n = minps; n <= maxps; n++) {
					const ps = new PSProjectStack();
					ps.Project_id = project.Project_id;
					ps.Stack_id = m++;
					await ps.save();
				}
			} else {
				const ps = new PSProjectStack();
				ps.Project_id = project.Project_id;
				ps.Stack_id = maxps;
				await ps.save();
			}

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

			const pc2User = faker.random.number({ min: 1, max: 40 });
			if (pc2User !== project.Owner_id) {
				const pc2 = new PCProjectCandidate();
				pc2.Project_Postion_id = pp.PP_id;
				pc2.Candidate_id = pc2User;
				pc2.Allowed = 'Allowed';
				await pc2.save();
			}

			const user = await User.findOne({ where: { User_id: project.Owner_id }, select: ['Username'] });
			const chat = new Chat();
			chat.Project_id = project.Project_id;
			chat.User_id = project.Owner_id;
			chat.Contents = `Hi. Nice to Meet u. Myname is ${user.Username}`;
			await chat.save();

			const user2 = await User.findOne({ where: { User_id: pc2User }, select: ['Username'] });
			const chat2 = new Chat();
			chat2.Project_id = project.Project_id;
			chat2.User_id = pc2User;
			chat2.Contents = `Hi. I'm ${user2.Username}. Thank you for letting me take part in ${project.Project_name}`;
			await chat2.save();
		}
	}
}
