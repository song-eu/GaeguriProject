import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PTProjectTag } from './PT_ProjectTag';
import { PSProjectStack } from './PS_ProjectStack';
import { Chat } from './Chat';
import { PCProjectCandidate } from './PC_ProjectCandidate';

@Entity()
export class Project {
	@PrimaryGeneratedColumn()
	Project_id: number;

	@Column('varchar', { length: 255 })
	Project_name: string;

	@Column()
	StartAt: Date;

	@Column()
	EndAt: Date;

	@Column({ type: 'text' })
	Desc: string;

	@Column()
	No_FE: number;

	@Column()
	No_BE: number;

	@Column()
	No_FS: number;

	// status data 정의 필요
	// enum type column도 괜찮을듯
	@Column('varchar', { length: 50 })
	status: string;

	@Column()
	createdBy: string;

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
	@OneToMany((type) => PCProjectCandidate, (pc) => pc.project)
	projectcandidate: PCProjectCandidate[];
}
