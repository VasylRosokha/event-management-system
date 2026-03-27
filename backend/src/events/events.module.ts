import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Participant } from 'src/participants/participant.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Participant, User]), UsersModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
