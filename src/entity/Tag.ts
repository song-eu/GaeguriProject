import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PTProjectTag } from './PT_ProjectTag';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn()
	Tag_id: number;

	@Column('varchar', { length: 255 })
	Tag_name: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@OneToMany((type) => PTProjectTag, (PT) => PT.tag)
	projecttag: PTProjectTag[];
}
