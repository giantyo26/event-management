import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeTables1718787793126 implements MigrationInterface {
    name = 'InitializeTables1718787793126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL, "cityId" integer)`);
        await queryRunner.query(`CREATE TABLE "city" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "country" varchar NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL, "cityId" integer, CONSTRAINT "FK_523996137e0ed701b0e683d8693" FOREIGN KEY ("cityId") REFERENCES "city" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_event"("id", "name", "price", "cityId") SELECT "id", "name", "price", "cityId" FROM "event"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
        await queryRunner.query(`CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL, "cityId" integer)`);
        await queryRunner.query(`INSERT INTO "event"("id", "name", "price", "cityId") SELECT "id", "name", "price", "cityId" FROM "temporary_event"`);
        await queryRunner.query(`DROP TABLE "temporary_event"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
