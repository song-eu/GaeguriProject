import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Project } from '../../entities/Project';

define(Project, (faker: typeof Faker) => {
	const num = faker.random.number(300);
	const endAt = faker.date.between('2020-07-01', '2020-12-31');
	const usernum = faker.random.number({ min: 1, max: 10 });

	const prj = new Project();
	prj.Project_name = `Test 구함 !!! ${num}`;
	prj.EndAt = endAt;
	prj.Desc = `Test project ${num}`;
	prj.Owner_id = usernum;
	return prj;
});
