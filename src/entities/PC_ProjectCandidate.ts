import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
	BaseEntity,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';
import { Position } from './Position';

@Entity()
export class PCProjectCandidate extends BaseEntity {
	@PrimaryGeneratedColumn()
	PC_id: number;

	@Column()
	Project_id: number;

	@OneToMany((type) => Project, (project) => project.projectcandidate)
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@Column({ nullable: true })
	Sender_id: number;

	@OneToMany((type) => User, (user) => user.pc_sender)
	@JoinColumn({ name: 'Sender_id', referencedColumnName: 'User_id' })
	sender: User;

	@Column()
	Position_id: number;

	@OneToMany((type) => Position, (position) => position.projectcandidate)
	@JoinColumn({ name: 'Position_id' })
	position: Position;

	@Column()
	Candidate_id: number;

	@OneToMany((type) => User, (user) => user.pc_candidate)
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
