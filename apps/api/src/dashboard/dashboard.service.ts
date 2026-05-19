import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction as TransactionEntity } from '../transactions/transaction.entity';
import {
  Transaction,
  DashboardResponse,
  CashFlowPoint,
} from '@financial-partner/shared';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
  ) {}

  async getSummary(userId: string, month: string): Promise<DashboardResponse> {
    const [year, mo] = month.split('-').map(Number);

    // Previous month string
    const prevDate = new Date(year, mo - 2, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    // Start of 6-month cash flow window
    const startDate = new Date(year, mo - 6, 1);
    const startMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;

    const today = new Date().toISOString().slice(0, 10);

    const [currentAgg, prevAgg, scheduledAgg, recentRaw, upcomingRaw, cashFlowRaw] =
      await Promise.all([
        // A — current month completed aggregations
        this.repo
          .createQueryBuilder('t')
          .select('t.type', 'type')
          .addSelect('SUM(t.amount)', 'total')
          .where('t.user_id = :userId', { userId })
          .andWhere("to_char(t.date, 'YYYY-MM') = :month", { month })
          .andWhere('t.status = :status', { status: 'completed' })
          .groupBy('t.type')
          .getRawMany<{ type: string; total: string }>(),

        // B — previous month completed aggregations (for trend)
        this.repo
          .createQueryBuilder('t')
          .select('t.type', 'type')
          .addSelect('SUM(t.amount)', 'total')
          .where('t.user_id = :userId', { userId })
          .andWhere("to_char(t.date, 'YYYY-MM') = :prevMonth", { prevMonth })
          .andWhere('t.status = :status', { status: 'completed' })
          .groupBy('t.type')
          .getRawMany<{ type: string; total: string }>(),

        // C — current month scheduled aggregations (for projected balance)
        this.repo
          .createQueryBuilder('t')
          .select('t.type', 'type')
          .addSelect('SUM(t.amount)', 'total')
          .where('t.user_id = :userId', { userId })
          .andWhere("to_char(t.date, 'YYYY-MM') = :month", { month })
          .andWhere('t.status = :status', { status: 'scheduled' })
          .groupBy('t.type')
          .getRawMany<{ type: string; total: string }>(),

        // D — last 5 completed transactions (no month filter)
        this.repo
          .createQueryBuilder('t')
          .where('t.user_id = :userId', { userId })
          .andWhere('t.status = :status', { status: 'completed' })
          .orderBy('t.date', 'DESC')
          .addOrderBy('t.createdAt', 'DESC')
          .take(5)
          .getMany(),

        // E — next 5 scheduled transactions from today forward
        this.repo
          .createQueryBuilder('t')
          .where('t.user_id = :userId', { userId })
          .andWhere('t.status = :status', { status: 'scheduled' })
          .andWhere('t.date >= :today', { today })
          .orderBy('t.date', 'ASC')
          .take(5)
          .getMany(),

        // F — cash flow last 6 months (completed, grouped by month and type)
        this.repo
          .createQueryBuilder('t')
          .select("to_char(t.date, 'YYYY-MM')", 'ym')
          .addSelect('t.type', 'type')
          .addSelect('SUM(t.amount)', 'total')
          .where('t.user_id = :userId', { userId })
          .andWhere('t.status = :status', { status: 'completed' })
          .andWhere("to_char(t.date, 'YYYY-MM') >= :startMonth", { startMonth })
          .andWhere("to_char(t.date, 'YYYY-MM') <= :month", { month })
          .groupBy("to_char(t.date, 'YYYY-MM'), t.type")
          .orderBy("to_char(t.date, 'YYYY-MM')", 'ASC')
          .getRawMany<{ ym: string; type: string; total: string }>(),
      ]);

    // — Summary calculations —
    const totalIncome = Number(currentAgg.find((r) => r.type === 'income')?.total ?? 0);
    const totalExpenses = Number(currentAgg.find((r) => r.type === 'expense')?.total ?? 0);
    const currentBalance = totalIncome - totalExpenses;

    const scheduledIncome = Number(scheduledAgg.find((r) => r.type === 'income')?.total ?? 0);
    const scheduledExpenses = Number(scheduledAgg.find((r) => r.type === 'expense')?.total ?? 0);
    const projectedBalance = currentBalance + scheduledIncome - scheduledExpenses;

    const prevIncome = Number(prevAgg.find((r) => r.type === 'income')?.total ?? 0);
    const prevExpenses = Number(prevAgg.find((r) => r.type === 'expense')?.total ?? 0);
    const incomeTrend = calcTrend(totalIncome, prevIncome);
    const expenseTrend = calcTrend(totalExpenses, prevExpenses);

    // — Current month label —
    const currentMonth = new Date(year, mo - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    // — Cash flow 6-month array —
    const cashFlowData = buildCashFlow(startMonth, month, cashFlowRaw);

    // — Normalize transaction entities —
    const recentTransactions = recentRaw.map(normalizeTransaction);
    const upcomingTransactions = upcomingRaw.map(normalizeTransaction);

    return {
      currentMonth,
      summary: { totalIncome, totalExpenses, currentBalance, projectedBalance, incomeTrend, expenseTrend },
      recentTransactions,
      upcomingTransactions,
      cashFlowData,
    };
  }
}

function calcTrend(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short' });
}

function buildCashFlow(
  startMonth: string,
  endMonth: string,
  raw: { ym: string; type: string; total: string }[],
): CashFlowPoint[] {
  // Build index from raw results
  const index: Record<string, { income: number; expenses: number }> = {};
  for (const row of raw) {
    if (!index[row.ym]) index[row.ym] = { income: 0, expenses: 0 };
    if (row.type === 'income') index[row.ym].income = Number(row.total);
    else index[row.ym].expenses = Number(row.total);
  }

  // Iterate over the 6-month window in order
  const result: CashFlowPoint[] = [];
  const [sy, sm] = startMonth.split('-').map(Number);
  const [ey, em] = endMonth.split('-').map(Number);
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    const ym = `${y}-${String(m).padStart(2, '0')}`;
    result.push({
      month: formatMonthLabel(ym),
      income: index[ym]?.income ?? 0,
      expenses: index[ym]?.expenses ?? 0,
    });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return result;
}

function normalizeTransaction(t: TransactionEntity): Transaction {
  return {
    id: t.id,
    userId: t.userId,
    type: t.type as Transaction['type'],
    recurrence: t.recurrence as Transaction['recurrence'],
    status: t.status as Transaction['status'],
    amount: Number(t.amount),
    description: t.description,
    category: (t.category ?? (t.type === 'income' ? 'income' : 'other')) as Transaction['category'],
    date: t.date,
    createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
    updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt),
  };
}
