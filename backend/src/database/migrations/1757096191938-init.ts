import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757096191938 implements MigrationInterface {
    name = 'Init1757096191938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(10000), "price" numeric(12,2) NOT NULL DEFAULT '0', "sku" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "last_modified_at" TIMESTAMP DEFAULT now(), "last_modified_by" uuid, "version" integer NOT NULL DEFAULT '1', "is_deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
