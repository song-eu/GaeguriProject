import 'dotenv/config';

import cors from 'cors';
import logger from 'morgan';

import { Response, NextFunction, static as expressStatic } from 'express';
import { GraphQLServer, PubSub } from 'graphql-yoga';

import { genSchema } from './utils/genSchema';
import typeormdbc from './ormconnection';
import decodeJWT from './utils/token/decodeJWT';
import multer from 'multer';
import path from 'path';
import { User } from './entities/User';
import { getRepository } from 'typeorm';

/*<----------------------------multer file-upload-------------------------------->*/

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/profilePhoto/');
	},
	filename: function (req, file, cb) {
		const uploadedFile = {
			name: req.params.email.split('@')[0],
			ext: file.mimetype.split('/')[1],
		};
		//console.log('----------filename???', req.params.email);
		cb(null, new Date().valueOf() + '_' + uploadedFile.name + '.' + uploadedFile.ext);
	},
});

function checkFileType(file, cb) {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/gif'
	) {
		// check file type to be png, jpeg, or jpg
		cb(null, true);
	} else {
		cb(null, false); // else fails
	}
}
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
});
/*<----------------------------class App-------------------------------->*/

class App {
	public app: GraphQLServer;
	private pubSub: any;
	private schema: any;
	constructor() {
		this.schema = genSchema();
		this.pubSub = new PubSub();
		this.pubSub.ee.setMaxListeners(99);
		this.app = new GraphQLServer({
			schema: this.schema,
			context: (req) => {
				const { connection: { context = null } = {} } = req;
				//connection의 default 값은 빈 객체, context의 default값은 null로 정해줘야 컴파일 에러가 안남.
				//(default값 안정해주면 undefined 값은 context의 property로 있을 수 없다면서 자꾸 에러남)
				return {
					req: req.request,
					pubSub: this.pubSub,
					//데이터 쌍방향 통신 (publish-Subscribe)
					connectionContext: context,
					//connection.context 안에 currentUser 라는 이름으로 이전에 저장한 user객체로 접근이 가능해진다.
					//이제 context로 어디서든지 WebSocket 통신을 이용하는 user에게 또한 접근이 가능해진다.
				};
			},
		});
		typeormdbc();
		this.middlewares();
	}
	private middlewares = (): void => {
		this.app.express.use(this.jwt);
		this.app.express.use(cors());
		this.app.express.use(logger('dev'));
		this.app.express.post(
			'/upload/profile/:email',
			upload.fields([{ name: 'imgProfile' }, { name: 'User_id' }, { name: 'Email' }]),
			async (req, res) => {
				try {
					//const con = await typeormdbc();
					const { files, user } = req;
					const { User_id, Email } = req.body;
					if (!files) {
						const error = new Error('Please upload a file');
						return res.send(error);
					}

					console.log('-----------files', files['imgProfile'][0].filename, User_id);
					if (files['imgProfile']) {
						//const filePath = files['imgProfile'][0].filename;
						//console.log(filePath);
						const profilePath = '/profile' + '/' + files['imgProfile'][0].filename;
						const userPath = await getRepository(User).update({ User_id }, { Profile_photo_path: profilePath });
						//res.send(userPath);
						files['imgProfile'] = { ...files['imgProfile'][0], url: profilePath };
					}

					res.send(files['imgProfile']);
				} catch (err) {
					console.log('-----------err??', err);
					res.sendStatus(400);
				}
			}
		);
		this.app.express.use('/profile', expressStatic(path.join(__dirname, '../upload/profilePhoto')));
	};
	private jwt = async (req, res: Response, next: NextFunction): Promise<void> => {
		const token = req.get('X-JWT');
		//req.headers에 {'X-JWT':token}하면 req.user의 User_id 접근 가능.
		if (token) {
			const user = await decodeJWT(token);
			// 토큰이 있을 경우 token을 풀어 유저 정보를 가져온다.
			if (user) {
				req.user = user;
			} else {
				req.user = undefined;
			}
		}
		next();
	};
}

export default new App().app;
