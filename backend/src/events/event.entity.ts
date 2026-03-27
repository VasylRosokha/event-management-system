import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Participant } from '../participants/participant.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ default: 'public' })
  visibility: string;

  @ManyToOne(() => User, (user) => user.organizedEvents, { nullable: false })
  organizer: User;

  @OneToMany(() => Participant, (participant) => participant.event, {
    cascade: true, // automatically persist/update participants
    onDelete: 'CASCADE', // delete participants when event is deleted
  })
  participants: Participant[];
}
