import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { EXPENSE_CATEGORIES } from '@financial-partner/shared';

export class UpdateGoalDto {
  @ApiPropertyOptional({ type: [String], enum: EXPENSE_CATEGORIES })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(EXPENSE_CATEGORIES, { each: true })
  categories?: string[];

  @ApiPropertyOptional({ example: 750.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  limitAmount?: number;
}
