import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './Project';
import { Stack } from './Stack';

@Entity()
export class PSProjectStack {
	@PrimaryGeneratedColumn()
	PS_id: number;

	@ManyToOne((type) => Project, (project) => project.projectstack)
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@ManyToOne((type) => Stack, (stack) => stack.projectstack)
	@JoinColumn({ name: 'Stack_id' })
	stack: Stack;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;
}
