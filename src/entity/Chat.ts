import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@Entity()
export class Chat {
	@PrimaryGeneratedColumn()
	Chat_id: number;

	@ManyToOne((type) => Project, (project) => project.chat, { cascade: true })
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@ManyToOne((type) => User, (user) => user.chat, { cascade: true })
	@JoinColumn({ name: 'User_id' })
	user: User;

	@Column({ type: 'text' })
	Message: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;
}
