import { ApiProperty } from '@nestjs/swagger';

export class GoalResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty({ type: [String] }) categories: string[];
  @ApiProperty() limitAmount: number;
  @ApiProperty() month: string;
  @ApiProperty() spentAmount: number;
  @ApiProperty() percentageUsed: number;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
