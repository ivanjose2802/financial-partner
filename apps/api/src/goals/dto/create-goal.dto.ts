import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { EXPENSE_CATEGORIES } from '@financial-partner/shared';

export class CreateGoalDto {
  @ApiProperty({ type: [String], enum: EXPENSE_CATEGORIES, example: ['restaurants', 'food'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(EXPENSE_CATEGORIES, { each: true })
  categories: string[];

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @Min(0.01)
  limitAmount: number;

  @ApiPropertyOptional({ example: '2026-05', description: 'YYYY-MM, defaults to current month' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/)
  month?: string;
}
