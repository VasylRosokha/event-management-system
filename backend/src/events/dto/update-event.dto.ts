import { IsString, IsDateString, IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Team Meetup' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Monthly sync for the team' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2026-04-15T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Kyiv, Ukraine' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ enum: ['public', 'private'] })
  @IsIn(['public', 'private'])
  @IsOptional()
  visibility?: string;
}