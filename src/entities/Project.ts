import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	BaseEntity,
	JoinColumn,
} from 'typeorm';
import { PTProjectTag } from './PT_ProjectTag';
import { PSProjectStack } from './PS_ProjectStack';
import { Chat } from './Chat';
import { PCProjectCandidate } from './PC_ProjectCandidate';
import { PPProjectPositionNo } from './PP_ProjectPositionNo';

@Entity()
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn()
	Project_id: number;

	@Column('varchar', { length: 255 })
	Project_name: string;

	@Column({ nullable: true })
	StartAt: Date;

	@Column({ nullable: true })
	EndAt: Date;

	@Column({ type: 'text', nullable: true })
	Desc: string;

	// status data 정의 필요
	// enum type column도 괜찮을듯
	@Column('varchar', { length: 50, default: 'await' })
	status: string;

	@Column({ nullable: true })
	createdBy: number;

	@Column({ nullable: true })
	Owner_id: number;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;

	@OneToMany((type) => PTProjectTag, (PT) => PT.project)
	projecttag: PTProjectTag[];
	@OneToMany((type) => PSProjectStack, (PS) => PS.project)
	projectstack: PSProjectStack[];
	@OneToMany((type) => Chat, (chat) => chat.project)
	chat: Chat[];

	@OneToMany((type) => PPProjectPositionNo, (pc) => pc.project)
	projectpositionno: PPProjectPositionNo[];
}
