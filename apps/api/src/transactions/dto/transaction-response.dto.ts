import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ['income', 'expense'] })
  type: string;

  @ApiProperty({ enum: ['one_time', 'recurring'] })
  recurrence: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  category: string | null;

  @ApiProperty()
  date: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
