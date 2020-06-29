import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	BaseEntity,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UFUserFriend extends BaseEntity {
	@PrimaryGeneratedColumn()
	UF_id: number;

	@Column()
	Follower_id: number;

	@ManyToOne(() => User, (user) => user.uf_follower)
	@JoinColumn({ name: 'Follower_id', referencedColumnName: 'User_id' })
	follower: User;

	@Column()
	Followee_id: number;

	@ManyToOne(() => User, (user) => user.uf_followee)
	@JoinColumn({ name: 'Followee_id', referencedColumnName: 'User_id' })
	followee: User;

	@CreateDateColumn({ name: 'createdAt' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updatedAt' })
	updatedAt: Date;
}
