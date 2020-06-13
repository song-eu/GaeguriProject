import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	OneToOne,
	JoinTable,
	JoinColumn,
} from 'typeorm';
import { USUserStack } from './US_UserStack';
import { Chat } from './Chat';
import { PCProjectCandidate } from './PC_ProjectCandidate';
import { Position } from './Position';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	User_id: number;

	@Column()
	Email: string;

	@Column()
	Password: string;

	@Column()
	Username: string;

	@OneToOne((type) => Position, (position) => position.user)
	@JoinColumn({ name: 'Position_id' })
	position: Position;

	@Column({ type: 'text' })
	AboutMe: string;

	@Column({ type: 'text' })
	Career: string;

	@Column()
	Grade: number;

	@Column()
	User_url: string;

	@Column()
	Profile_photo_path: string;

	@Column()
	User_role: string;

	@Column()
	Allow_Invitation: boolean;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;

	@OneToMany((type) => USUserStack, (US) => US.user)
	userstack: USUserStack[];

	@OneToMany((type) => Chat, (chat) => chat.user)
	chat: Chat[];

	@OneToMany((type) => PCProjectCandidate, (pc) => pc.sender)
	pc_sender: PCProjectCandidate;

	@OneToMany((type) => PCProjectCandidate, (pc) => pc.candidate)
	pc_candidate: PCProjectCandidate;
}
