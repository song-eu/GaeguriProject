import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../entities/User';
const arrAboutme = [
	'코딩을 열심히 하자',
	'사이드 프로젝트 완성하기',
	'개구리개굴개굴',
	'BTS Love',
	'공유 Love',
	'화이팅!',
	'열심히 하겠습니다.',
	'주니어 개발자로 일하고 싶습니다.',
	'사이드프로젝트는 처음이라',
	'구석에서 나오고 있는중입니다.',
	'개구리입니다. 개굴개굴',
	'세계최고 개발자 될거임',
	'Roceket 🚀',
];
import * as bcrypt from 'bcrypt';
const BCRYPT_ROUND = 10;
define(User, (faker: typeof Faker) => {
	const gender = faker.random.number(1);
	const firstName = faker.name.firstName(gender);
	const lastName = faker.name.lastName(gender);
	const email = faker.internet.email();

	const user = new User();
	user.Email = firstName.toLowerCase() + '@' + email.split('@')[1];
	user.Username = `${firstName} ${lastName}`;
	user.password = 'test'
	user.Position_id = faker.random.number({ min: 1, max: 3 });
	user.AboutMe = arrAboutme[faker.random.number({ min: 1, max: 10 })];
	return user;
});
