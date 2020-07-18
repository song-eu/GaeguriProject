import Faker, { fake } from 'faker';
import { define } from 'typeorm-seeding';
import { Project } from '../../entities/Project';

define(Project, (faker: typeof Faker) => {
	const num = faker.random.number(300);
	const endAt = faker.date.between('2020-07-30', '2020-12-31');
	const usernum = faker.random.number({ min: 1, max: 40 });
	let randomname = [];
	const randomColor = faker.commerce.color().toUpperCase();
	const randomCity = faker.address.city();
	const randomCompany = faker.company.companyName();
	const randomFileName = faker.commerce.productName();
	// const randomSentence = faker.lorem.sentence();

	const color = `프로젝트 팀 ${randomColor} 멤버 구함 !!!`;
	const city = `${randomCity} 지역 같이 사이드 프로젝트 하실 분 구합니다. `;
	const company = `[${randomCompany}] 기업 단기 프로젝트 멤버 급구`;
	const filename = `Let's create App for ${randomFileName} Factory together! Please Join with me`;
	// const sentence = `${randomSentence}`;
	randomname = [color, city, company, filename];

	const prj = new Project();
	prj.Project_name = randomname[faker.random.number({ min: 0, max: 3 })];
	prj.EndAt = endAt;
	prj.Desc = '열심히 개발하실 분을 찾습니다. 개굴개굴';
	prj.Owner_id = usernum;
	prj.createdBy = usernum;
	return prj;
});
