import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { User } from './User';
import { Stack } from './Stack';

@Entity()
export class USUserStack {
	@PrimaryGeneratedColumn()
	US_id: number;

	@ManyToOne((type) => User, (user) => user.userstack, { cascade: true })
	@JoinColumn({ name: 'User_id' })
	user: User;

	@ManyToOne((type) => Stack, (stack) => stack.userstack, { cascade: true })
	@JoinColumn({ name: 'Stack_id' })
	stack: Stack;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;
}
