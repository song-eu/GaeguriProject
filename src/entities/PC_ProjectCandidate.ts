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
	OneToOne,
} from 'typeorm';
import { User } from './User';
import { PPProjectPositionNo } from './PP_ProjectPositionNo';

@Entity()
export class PCProjectCandidate extends BaseEntity {
	@PrimaryGeneratedColumn()
	PC_id: number;

	@Column()
	Project_Postion_id: number;

	@ManyToOne((type) => PPProjectPositionNo, (pp) => pp.PC)
	@JoinColumn({ name: 'Project_Postion_id', referencedColumnName: 'PP_id' })
	PP: PPProjectPositionNo;

	@Column({ nullable: true })
	Sender_id: number;

	@ManyToOne((type) => User, (user) => user.pc_sender)
	@JoinColumn({ name: 'Sender_id', referencedColumnName: 'User_id' })
	sender: User;

	@Column()
	Candidate_id: number;

	@ManyToOne((type) => User, (user) => user.pc_candidate)
	@JoinColumn({ name: 'Candidate_id', referencedColumnName: 'User_id' })
	candidate: User;

	@Column('varchar', { length: 50 })
	Allowed: string;

	@Column('text', { nullable: true })
	Answer: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;
}
