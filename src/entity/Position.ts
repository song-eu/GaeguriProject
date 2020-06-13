import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { PCProjectCandidate } from './PC_ProjectCandidate';
import { User } from './User';

@Entity()
export class Position {
	@PrimaryGeneratedColumn()
	Position_id: number;

	@Column()
	Position_name: string;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@OneToMany((type) => PCProjectCandidate, (pc) => pc.position)
	projectcandidate: PCProjectCandidate[];

	@OneToOne((type) => User, (user) => user.position)
	user: User;
}
