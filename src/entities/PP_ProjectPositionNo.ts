import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, BaseEntity } from 'typeorm';
import { Project } from './Project';
import { Position } from './Position';

@Entity()
export class PPProjectPositionNo extends BaseEntity {
	@PrimaryGeneratedColumn()
	PP_id: number;

	@Column()
	Project_id: number;

	@Column()
	Position_id: number;

	@ManyToOne((type) => Project, (project) => project.projectpositionno)
	@JoinColumn({ name: 'Project_id', referencedColumnName: 'Project_id' })
	project: Project;

	@ManyToOne((type) => Position, (position) => position.projectpositionno)
	@JoinColumn({ name: 'Position_id' })
	position: Position;

	@Column()
	NoOfPosition: number;
}
