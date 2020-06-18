import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
	OneToOne,
	BaseEntity,
	ManyToMany,
	ManyToOne,
} from 'typeorm';
import { PCProjectCandidate } from './PC_ProjectCandidate';
import { User } from './User';
import { PPProjectPositionNo } from './PP_ProjectPositionNo';

@Entity()
export class Position extends BaseEntity {
	@PrimaryGeneratedColumn()
	Position_id: number;

	@Column('varchar', { length: 50 })
	Position_name: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@OneToMany((type) => PPProjectPositionNo, (pc) => pc.position)
	projectpositionno: PPProjectPositionNo[];
	@OneToOne((type) => User, (user) => user.position)
	user: User;
}
