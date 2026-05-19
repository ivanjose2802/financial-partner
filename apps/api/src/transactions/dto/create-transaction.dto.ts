import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EXPENSE_CATEGORIES } from '@financial-partner/shared';

const TRANSACTION_TYPES = ['income', 'expense'] as const;
const RECURRENCES = ['one_time', 'recurring'] as const;

export class CreateTransactionDto {
  @ApiProperty({ enum: TRANSACTION_TYPES })
  @IsIn(TRANSACTION_TYPES)
  type: string;

  @ApiProperty({ enum: RECURRENCES })
  @IsIn(RECURRENCES)
  recurrence: string;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Monthly rent' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: EXPENSE_CATEGORIES })
  @IsOptional()
  @IsIn(EXPENSE_CATEGORIES)
  category?: string;

  @ApiProperty({ example: '2025-05-18' })
  @IsDateString()
  date: string;
}
