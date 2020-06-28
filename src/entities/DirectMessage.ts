import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity()
export class DirectMessage extends BaseEntity {
	@PrimaryGeneratedColumn()
	DM_id: number;

	@ManyToOne(() => Message, (m) => m.dm)
	@JoinColumn({ name: 'Message_id', referencedColumnName: 'Message_id' })
	message: Message;

	@Column({ type: 'number', nullable: true })
	Message_id: number;

	@ManyToOne((type) => User, (user) => user.dm_user)
	@JoinColumn({ name: 'User_id', referencedColumnName: 'User_id' })
	user: User;

	@Column({ type: 'number', nullable: true })
	User_id: number;

	@Column({ type: 'text', nullable: true })
	Contents: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;
}
