import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.participations, { nullable: false })
  user: User;

  @ManyToOne(() => Event, (event) => event.participants, {
    nullable: false,
    onDelete: 'CASCADE', // delete participant if event is deleted
  })
  event: Event;
}
