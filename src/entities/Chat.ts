import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BaseEntity,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@Entity()
export class Chat extends BaseEntity {
	@PrimaryGeneratedColumn()
	Chat_id: number;

	@ManyToOne((type) => Project, (project) => project.chat, { cascade: true })
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@Column({ type: 'number' })
	Project_id: number;

	@ManyToOne((type) => User, (user) => user.chat, { cascade: true })
	@JoinColumn({ name: 'User_id' })
	user: User;

	@Column({ type: 'number' })
	User_id: number;

	@Column({ type: 'text', nullable: true })
	Message: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;
}
