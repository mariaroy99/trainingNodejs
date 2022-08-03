import {MigrationInterface, QueryRunner} from "typeorm";

export class withAddress11659513568376 implements MigrationInterface {
    name = 'withAddress11659513568376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "pinoode" TO "pincode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "pincode" TO "pinoode"`);
    }

}
