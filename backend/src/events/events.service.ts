import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { Participant } from '../participants/participant.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>, // <-- added Participant repo
  ) {}

  // Create a new event
  async createEvent(dto: any, payloadUser: any): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: payloadUser.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const { title, description, date, location, capacity, visibility } = dto;

    if (!title || !date || !location) {
      throw new Error('Title, date, and location are required');
    }

    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      throw new Error('Cannot create events in the past');
    }

    const event = this.eventRepository.create({
      title,
      description,
      date: eventDate,
      location,
      capacity: capacity ?? null,
      visibility: visibility ?? 'public',
      organizer: user,
    });

    await this.eventRepository.save(event);

    const { password, ...organizerSafe } = user;
    return { ...event, organizer: organizerSafe };
  }

  // Get all public events
  async getAllPublicEvents(): Promise<any[]> {
    const events = await this.eventRepository.find({
      where: { visibility: 'public' },
      relations: ['organizer', 'participants', 'participants.user'], // load participants too
      order: { date: 'ASC' },
    });

    return events.map((event) => ({
      ...event,
      organizer: event.organizer
        ? (({ password, ...rest }) => rest)(event.organizer)
        : null,
      participants: event.participants.map((p) => ({
        id: p.user.id,
        email: p.user.email,
      })),
    }));
  }

  // Get single event by id
  async getEventById(id: string): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'participants.user'],
    });
    if (!event) throw new NotFoundException('Event not found');

    const organizerSafe = event.organizer
      ? (({ password, ...rest }) => rest)(event.organizer)
      : null;

    const participantsSafe = event.participants.map((p) => ({
      id: p.user.id,
      email: p.user.email,
    }));

    return {
      ...event,
      organizer: organizerSafe,
      participants: participantsSafe,
    };
  }

  // Update event (only organizer can update)
  async updateEvent(id: string, dto: any, payloadUser: any): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'participants.user'],
    });
    if (!event) throw new NotFoundException('Event not found');

    if (event.organizer.id !== payloadUser.userId) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    Object.assign(event, dto);
    await this.eventRepository.save(event);

    const organizerSafe = event.organizer
      ? (({ password, ...rest }) => rest)(event.organizer)
      : null;

    const participantsSafe = event.participants.map((p) => ({
      id: p.user.id,
      email: p.user.email,
    }));

    return {
      ...event,
      organizer: organizerSafe,
      participants: participantsSafe,
    };
  }

  // Delete event (only organizer can delete)
  async deleteEvent(id: string, payloadUser: any): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants'],
    });
    if (!event) throw new NotFoundException('Event not found');

    if (event.organizer.id !== payloadUser.userId) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }

    await this.eventRepository.remove(event);
  }

  // Join an event
  async joinEvent(eventId: string, payloadUser: any): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['participants', 'participants.user', 'organizer'],
    });
    if (!event) throw new NotFoundException('Event not found');

    const user = await this.userRepository.findOne({
      where: { id: payloadUser.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    if (event.participants.some((p) => p.user.id === user.id)) {
      throw new ForbiddenException('You are already joined to this event');
    }

    if (event.capacity && event.participants.length >= event.capacity) {
      throw new ForbiddenException('Event is full');
    }

    const participant = this.participantRepository.create({
      user,
      event,
    });
    await this.participantRepository.save(participant);

    // Reload event to include updated participants
    return this.getEventById(eventId);
  }

  // Leave an event
  async leaveEvent(eventId: string, payloadUser: any): Promise<any> {
    const participant = await this.participantRepository.findOne({
      where: { user: { id: payloadUser.userId }, event: { id: eventId } },
      relations: ['user', 'event'],
    });
    if (!participant)
      throw new NotFoundException('You are not joined to this event');

    await this.participantRepository.remove(participant);

    return this.getEventById(eventId);
  }

  // src/events/events.service.ts
  async getUserEvents(payloadUser: any): Promise<any[]> {
    // Load full user entity
    const user = await this.userRepository.findOne({
      where: { id: payloadUser.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // Fetch events where user is organizer OR participant
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'participantUser')
      .where('organizer.id = :userId', { userId: user.id })
      .orWhere('participantUser.id = :userId', { userId: user.id })
      .orderBy('event.date', 'ASC')
      .getMany();

    // Remove sensitive info (organizer and participants)
    return events.map((event) => {
      const organizerSafe = event.organizer
        ? (({ password, ...rest }) => rest)(event.organizer)
        : null;

      const participantsSafe = event.participants?.map((p) => {
        const { password, ...rest } = p.user;
        return rest;
      });

      return {
        ...event,
        organizer: organizerSafe,
        participants: participantsSafe,
      };
    });
  }
}
