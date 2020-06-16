import passport from 'passport';
import bcrypt from 'bcrypt';
const LocalStrategy = require('passport-local').Strategy;

import { User } from '../../entities/User';

// passport local은 email/pw 기반의 일반적인 로그인을 가능하게 하는 connect다.

const setupPassportAuth = () => {
	const local = () => {
		passport.use(
			new LocalStrategy(
				{
					usernameField: 'email',
					passwordField: 'password',
				},
				async (email: string, password: string, done) => {
					try {
						const user = await User.findOne({ Email: email.toLowerCase() });
						if (!user) {
							return done(null, false, { message: `${email}은 유효하지 않은 이메일입니다` });
						}

						// 하단의 부분은 resolver가 생기면 교체 가능

						const isValid = await bcrypt.compare(password, user.Password);
						return isValid ? done(null, user) : done(null, false, { message: '유효하지 않은 비밀번호입니다' });
					} catch (error) {
						console.error(error);
					}
				}
			)
		);
	};

	passport.serializeUser((user: User, done) => {
		return done(null, user.User_id);
	});
	passport.deserializeUser(async (id, done) => {
		try {
			console.log('Passport id ?', id);
			const user = await User.findOne({ where: { User_id: id } });
			return done(null, user ? { id: user.User_id, username: user.Username } : false);
		} catch (error) {
			return done(error);
		}
	});
	local();
	console.log('Passport is running...');
};

export default setupPassportAuth;
