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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateEventDto, @Request() req: any) {
    return this.eventsService.createEvent(dto, req.user);
  }

  @ApiOperation({ summary: 'Get all public events' })
  @Get()
  async getAll() {
    return this.eventsService.getAllPublicEvents();
  }

  @ApiOperation({ summary: 'Get event by ID' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @ApiOperation({ summary: 'Update an event (organizer only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Request() req: any) {
    return this.eventsService.updateEvent(id, dto, req.user);
  }

  @ApiOperation({ summary: 'Delete an event (organizer only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.eventsService.deleteEvent(id, req.user);
    return { message: 'Event deleted successfully' };
  }

  @ApiOperation({ summary: 'Join an event' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.joinEvent(id, req.user);
  }

  @ApiOperation({ summary: 'Leave an event' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.leaveEvent(id, req.user);
  }

  @ApiOperation({ summary: 'Get events for the current user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/users/me/events')
  async getMyEvents(@Request() req: any) {
    return this.eventsService.getUserEvents(req.user);
  }
}