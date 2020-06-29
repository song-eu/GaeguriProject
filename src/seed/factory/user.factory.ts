import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../entities/User';

define(User, (faker: typeof Faker) => {
	const gender = faker.random.number(1);
	const firstName = faker.name.firstName(gender);
	const lastName = faker.name.lastName(gender);
	const email = faker.internet.email();

	const user = new User();
	user.Email = email;
	user.Username = `${firstName} ${lastName}`;
	//user.password = faker.random.word()
	user.Password = 'test';
	user.Position_id = faker.random.number({ min: 1, max: 3 });
	return user;
});
