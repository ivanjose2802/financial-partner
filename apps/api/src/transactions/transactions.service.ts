import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PaginatedResponse } from '@financial-partner/shared';

export interface TransactionFilters {
  month?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.repo.create({ ...dto, userId });
    return this.repo.save(transaction);
  }

  async findAll(
    userId: string,
    filters: TransactionFilters = {},
  ): Promise<PaginatedResponse<Transaction>> {
    const { month, type, status, page = 1, limit = 20 } = filters;

    const qb = this.repo
      .createQueryBuilder('t')
      .where('t.user_id = :userId', { userId })
      .orderBy('t.date', 'DESC')
      .addOrderBy('t.createdAt', 'DESC');

    if (month) {
      qb.andWhere("to_char(t.date, 'YYYY-MM') = :month", { month });
    }
    if (type) {
      qb.andWhere('t.type = :type', { type });
    }
    if (status) {
      qb.andWhere('t.status = :status', { status });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.repo.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(userId, id);
    Object.assign(transaction, dto);
    return this.repo.save(transaction);
  }

  async remove(userId: string, id: string): Promise<void> {
    const transaction = await this.findOne(userId, id);
    await this.repo.remove(transaction);
  }
}
