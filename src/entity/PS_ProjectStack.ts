import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Project } from './Project';
import { Stack } from './Stack';

@Entity()
export class PSProjectStack extends BaseEntity {
	@PrimaryGeneratedColumn()
	PS_id: number;

	@Column()
	Project_id: number;

	@Column()
	Stack_id: number;

	@ManyToOne((type) => Project, (project) => project.projectstack)
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@ManyToOne((type) => Stack, (stack) => stack.projectstack)
	@JoinColumn({ name: 'Stack_id' })
	stack: Stack;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;
}
