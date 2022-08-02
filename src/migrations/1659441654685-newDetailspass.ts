import {MigrationInterface, QueryRunner} from "typeorm";

export class newDetailspass1659441654685 implements MigrationInterface {
    name = 'newDetailspass1659441654685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "password"`);
    }

}
