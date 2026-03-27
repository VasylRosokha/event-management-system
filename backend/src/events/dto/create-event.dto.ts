import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsIn(['public', 'private'])
  @IsOptional()
  visibility?: string;
}