import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Team Meetup' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Monthly sync for the team' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-04-15T18:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Kyiv, Ukraine' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ enum: ['public', 'private'], default: 'public' })
  @IsIn(['public', 'private'])
  @IsOptional()
  visibility?: string;
}