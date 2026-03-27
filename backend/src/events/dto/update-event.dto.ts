import { IsString, IsDateString, IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsIn(['public', 'private'])
  @IsOptional()
  visibility?: string;
}