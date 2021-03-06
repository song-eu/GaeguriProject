import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import { USUserStack } from './US_UserStack';
import { PSProjectStack } from './PS_ProjectStack';

@Entity()
export class Stack extends BaseEntity {
	@PrimaryGeneratedColumn()
	Stack_id: number;

	@Column('varchar', { length: 200 })
	Stack_name: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@OneToMany((type) => USUserStack, (US) => US.stack)
	userstack: USUserStack[];

	@OneToMany((type) => PSProjectStack, (PS) => PS.stack)
	projectstack: PSProjectStack[];
}
