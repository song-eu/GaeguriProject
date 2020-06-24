import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	OneToOne,
	JoinColumn,
	BaseEntity,
	ManyToOne,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import { USUserStack } from './US_UserStack';
import { Chat } from './Chat';
import { PCProjectCandidate } from './PC_ProjectCandidate';
import { Position } from './Position';
import * as bcrypt from 'bcrypt';
const BCRYPT_ROUND = 10;
@Entity('user')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	User_id: number;

	@Column('varchar', { length: 255, unique: true })
	Email: string;

	@Column('text')
	Password: string;

	@Column('varchar', { length: 255, nullable: true })
	Username: string;

	@Column({ type: 'text', nullable: true })
	PhoneNumber: string;

	@Column({ type: 'boolean', nullable: true })
	VerifiedPhoneNumber: boolean;

	@Column({ type: 'text', nullable: true })
	Position_id: number;

	@ManyToOne(() => Position, (position) => position.user)
	@JoinColumn({ name: 'Position_id', referencedColumnName: 'Position_id' })
	position: Position;

	@Column({ type: 'text', nullable: true })
	AboutMe: string;

	@Column({ type: 'text', nullable: true })
	Career: string;

	@Column({ nullable: true })
	Grade: number;

	@Column('text', { nullable: true })
	User_url: string;

	@Column('text', { nullable: true })
	Profile_photo_path: string;

	@Column('varchar', { length: 50, nullable: true })
	User_role: string;

	@Column({ nullable: true })
	Allow_Invitation: boolean;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;

	@OneToMany(() => USUserStack, (US) => US.user)
	userstack: USUserStack[];

	@OneToMany(() => Chat, (chat) => chat.user)
	chat: Chat[];

	@OneToMany(() => PCProjectCandidate, (pc) => pc.sender)
	pc_sender: PCProjectCandidate;

	@OneToMany((type) => PCProjectCandidate, (pc) => pc.candidate)
	pc_candidate: PCProjectCandidate[];

	@BeforeInsert()
	@BeforeUpdate()
	async savePassword(): Promise<void> {
		if (this.Password) {
			const hashedPassword = await bcrypt.hash(this.Password, BCRYPT_ROUND);
			this.Password = hashedPassword;
		}
	}
}
