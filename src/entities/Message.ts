import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { User } from './User';
import { DirectMessage } from './DirectMessage';

@Entity()
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn()
	Message_id: number;

	@Column()
	User1_id: number;

	@ManyToOne(() => User, (user) => user.m_user1)
	@JoinColumn({ name: 'User1_id', referencedColumnName: 'User_id' })
	user1: User;

	@Column()
	User2_id: number;

	@ManyToOne(() => User, (user) => user.m_user2)
	@JoinColumn({ name: 'User2_id', referencedColumnName: 'User_id' })
	user2: User;

	@OneToMany(() => DirectMessage, (dm) => dm.message)
	dm: DirectMessage[];

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;
}
