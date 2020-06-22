import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinTable,
	JoinColumn,
	BaseEntity,
} from 'typeorm';
import { User } from './User';
import { Stack } from './Stack';

@Entity()
export class USUserStack extends BaseEntity {
	@PrimaryGeneratedColumn()
	US_id: number;

	@Column()
	User_id: number;

	@ManyToOne((type) => User, (user) => user.userstack, { cascade: true })
	@JoinColumn({ name: 'User_id' })
	user: User;

	@Column()
	Stack_id: number;

	@ManyToOne((type) => Stack, (stack) => stack.userstack, { cascade: true })
	@JoinColumn({ name: 'Stack_id' })
	stack: Stack;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;
}
