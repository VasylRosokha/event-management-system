import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Event } from './events/event.entity';
import { Participant } from './participants/participant.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const eventRepo = app.get<Repository<Event>>(getRepositoryToken(Event));
  const participantRepo = app.get<Repository<Participant>>(getRepositoryToken(Participant));

  // Delete in FK order
  await participantRepo.createQueryBuilder().delete().execute();
  await eventRepo.createQueryBuilder().delete().execute();
  await userRepo.createQueryBuilder().delete().execute();

  // Create 2 users
  const [alice, bob] = await userRepo.save([
    {
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
    },
    {
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  ]);

  // Create 3 public events
  await eventRepo.save([
    {
      title: 'Tech Conference 2026',
      description: 'Annual tech conference covering the latest in web development and cloud.',
      date: new Date('2026-05-10T10:00:00.000Z'),
      location: 'Kyiv, Ukraine',
      capacity: 200,
      visibility: 'public',
      organizer: alice,
    },
    {
      title: 'React Workshop',
      description: 'Hands-on workshop building modern React applications with hooks and context.',
      date: new Date('2026-06-20T14:00:00.000Z'),
      location: 'Online',
      capacity: 50,
      visibility: 'public',
      organizer: bob,
    },
    {
      title: 'Community Meetup',
      description: 'Monthly community gathering for developers to share projects and ideas.',
      date: new Date('2026-07-05T18:00:00.000Z'),
      location: 'Lviv, Ukraine',
      capacity: 100,
      visibility: 'public',
      organizer: alice,
    },
  ]);

  console.log('Seeded: 2 users, 3 public events');
  console.log('  alice@example.com / password123');
  console.log('  bob@example.com   / password123');

  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});