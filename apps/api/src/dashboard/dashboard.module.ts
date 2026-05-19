import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction as TransactionEntity } from '../transactions/transaction.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
