import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // POST /events - protected
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateEventDto, @Request() req: any) {
    return this.eventsService.createEvent(dto, req.user);
  }

  // GET /events - public
  @Get()
  async getAll() {
    return this.eventsService.getAllPublicEvents();
  }

  // GET /events/:id - public
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  // PATCH /events/:id - protected
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Request() req: any) {
    return this.eventsService.updateEvent(id, dto, req.user);
  }

  // DELETE /events/:id - protected
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.eventsService.deleteEvent(id, req.user);
    return { message: 'Event deleted successfully' };
  }

  // JOIN EVENT
  // POST /events/:id/join
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.joinEvent(id, req.user);
  }

  // LEAVE EVENT
  // POST /events/:id/leave
  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.leaveEvent(id, req.user);
  }

  // GET /users/me/events - protected
  @UseGuards(JwtAuthGuard)
  @Get('/users/me/events')
  async getMyEvents(@Request() req: any) {
    return this.eventsService.getUserEvents(req.user);
  }
}
