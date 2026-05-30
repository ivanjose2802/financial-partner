import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoalsTable1780000000000 implements MigrationInterface {
  name = 'AddGoalsTable1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "goals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "categories" jsonb NOT NULL,
        "limit_amount" numeric(12,2) NOT NULL,
        "month" character varying(7) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_goals" PRIMARY KEY ("id"),
        CONSTRAINT "FK_goals_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_goals_user_month" ON "goals" ("user_id", "month")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_goals_user_month"`);
    await queryRunner.query(`DROP TABLE "goals"`);
  }
}
