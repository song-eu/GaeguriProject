import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Position } from './Position';
import { PCProjectCandidate } from './PC_ProjectCandidate';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';
import { join } from 'path';

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

	@OneToMany((type) => PCProjectCandidate, (pc) => pc.PP)
	@JoinColumn({ name: 'PP_id', referencedColumnName: 'Project_Postion_id' })
	PC: PCProjectCandidate[];
}
