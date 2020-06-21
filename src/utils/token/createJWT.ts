import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createJWT = (User_id: number): string => {
	const token = jwt.sign({ User_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7D' });
	return token;
};

export default createJWT;
