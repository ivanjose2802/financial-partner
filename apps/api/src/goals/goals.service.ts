import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { Transaction } from '../transactions/transaction.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalWithProgress } from '@financial-partner/shared';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepo: Repository<Goal>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  async create(userId: string, dto: CreateGoalDto): Promise<GoalWithProgress> {
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const goal = this.goalRepo.create({
      userId,
      categories: dto.categories,
      limitAmount: dto.limitAmount,
      month: dto.month ?? defaultMonth,
    });

    const saved = await this.goalRepo.save(goal);
    return this.attachProgress(saved);
  }

  async findAll(userId: string, month?: string): Promise<GoalWithProgress[]> {
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const targetMonth = month ?? defaultMonth;

    const goals = await this.goalRepo.find({
      where: { userId, month: targetMonth },
      order: { createdAt: 'ASC' },
    });

    return Promise.all(goals.map((g) => this.attachProgress(g)));
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<GoalWithProgress> {
    const goal = await this.findOneOwnedBy(userId, id);

    if (dto.categories !== undefined) goal.categories = dto.categories;
    if (dto.limitAmount !== undefined) goal.limitAmount = dto.limitAmount;

    const saved = await this.goalRepo.save(goal);
    return this.attachProgress(saved);
  }

  async remove(userId: string, id: string): Promise<void> {
    const goal = await this.findOneOwnedBy(userId, id);
    await this.goalRepo.remove(goal);
  }

  private async findOneOwnedBy(userId: string, id: string): Promise<Goal> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException();
    return goal;
  }

  private async attachProgress(goal: Goal): Promise<GoalWithProgress> {
    const today = new Date().toISOString().slice(0, 10);

    const row = await this.txRepo
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.user_id = :userId', { userId: goal.userId })
      .andWhere('t.type = :type', { type: 'expense' })
      .andWhere('t.category IN (:...categories)', { categories: goal.categories })
      .andWhere("to_char(t.date, 'YYYY-MM') = :month", { month: goal.month })
      .andWhere('t.date <= :today', { today })
      .getRawOne<{ total: string | null }>();

    const spentAmount = Number(row?.total ?? 0);
    const limitAmount = Number(goal.limitAmount);
    const percentageUsed = limitAmount > 0 ? Math.round((spentAmount / limitAmount) * 100) : 0;

    return {
      id: goal.id,
      userId: goal.userId,
      categories: goal.categories as GoalWithProgress['categories'],
      limitAmount,
      month: goal.month,
      spentAmount,
      percentageUsed,
      createdAt: goal.createdAt instanceof Date ? goal.createdAt.toISOString() : String(goal.createdAt),
      updatedAt: goal.updatedAt instanceof Date ? goal.updatedAt.toISOString() : String(goal.updatedAt),
    };
  }
}
