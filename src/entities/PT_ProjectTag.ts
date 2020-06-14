import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './Project';
import { Tag } from './Tag';

@Entity()
export class PTProjectTag {
	@PrimaryGeneratedColumn()
	PT_id: number;

	@ManyToOne((type) => Project, (project) => project.projecttag)
	@JoinColumn({ name: 'Project_id' })
	project: Project;

	@ManyToOne((type) => Tag, (tag) => tag.projecttag)
	@JoinColumn({ name: 'Tag_id' })
	tag: Tag;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;
}
