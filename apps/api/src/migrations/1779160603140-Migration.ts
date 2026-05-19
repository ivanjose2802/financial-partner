import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779160603140 implements MigrationInterface {
    name = 'Migration1779160603140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "status" character varying NOT NULL`);
    }

}
