import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionResponseDto } from '../../transactions/dto/transaction-response.dto';

export class CashFlowPointDto {
  @ApiProperty({ example: 'Jan' })
  month: string;

  @ApiProperty({ example: 4500 })
  income: number;

  @ApiProperty({ example: 3200 })
  expenses: number;
}

export class DashboardSummaryDto {
  @ApiProperty({ example: 8500 })
  totalIncome: number;

  @ApiProperty({ example: 5200 })
  totalExpenses: number;

  @ApiProperty({ example: 3300 })
  currentBalance: number;

  @ApiProperty({ example: 5800 })
  projectedBalance: number;

  @ApiPropertyOptional({ nullable: true, example: 12 })
  incomeTrend: number | null;

  @ApiPropertyOptional({ nullable: true, example: -5 })
  expenseTrend: number | null;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 'May 2026' })
  currentMonth: string;

  @ApiProperty({ type: DashboardSummaryDto })
  summary: DashboardSummaryDto;

  @ApiProperty({ type: [TransactionResponseDto] })
  recentTransactions: TransactionResponseDto[];

  @ApiProperty({ type: [TransactionResponseDto] })
  upcomingTransactions: TransactionResponseDto[];

  @ApiProperty({ type: [CashFlowPointDto] })
  cashFlowData: CashFlowPointDto[];
}
