import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';
import { Position } from './Position';

@Entity()
export class PCProjectCandidate {
	@PrimaryGeneratedColumn()
	PC_id: number;

	@ManyToOne((type) => Project, (project) => project.projectcandidate)
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@ManyToOne((type) => User, (user) => user.pc_sender)
	@JoinColumn({ name: 'Sender_id', referencedColumnName: 'User_id' })
	sender: User;

	@ManyToOne((type) => Position, (position) => position.projectcandidate)
	@JoinColumn({ name: 'Position_id' })
	position: Position;

	@ManyToOne((type) => User, (user) => user.pc_candidate)
	@JoinColumn({ name: 'Candidate_id', referencedColumnName: 'User_id' })
	candidate: User;

	@Column('varchar', { length: 50 })
	Allowed: string;

	@Column('varchar', { length: 50 })
	Owner: boolean;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;
}
