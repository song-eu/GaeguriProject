import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../../entities/User';

const decodeJWT = async (token: string): Promise<User | undefined> => {
	try {
		const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
		const { User_id } = decoded;
		console.log('User_id : ', User_id);
		return await User.findOne({ where: { User_id } });
	} catch (error) {
		return undefined;
	}
};

export default decodeJWT;
