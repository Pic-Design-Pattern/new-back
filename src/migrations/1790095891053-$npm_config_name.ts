import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1790095891053 implements MigrationInterface {
    name = ' $npmConfigName1790095891053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roupas_abelha" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "caminho_rosto" character varying, "caminho_caracteristicas" character varying, "caminho_oculos" character varying, "caminho_corpo" character varying, "caminho_acessorios" character varying, "caminho_cabelo" character varying, CONSTRAINT "PK_4c2e6ab3ecbd81c7d7b662d56f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roupas_desbloqueadas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "valor_compra" numeric(10,2) NOT NULL, "valor_venda" numeric(10,2) NOT NULL, "abelha_id" uuid, "roupa_abelha_id" uuid, CONSTRAINT "PK_a94e640fdb3ca9b9ac30be79c12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jogadores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "nivel" bigint NOT NULL DEFAULT '1', CONSTRAINT "PK_47e3895364f0c1590ec6f47e75f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "abelhas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "lore" text, "tamanho" character varying, "comida_favorita" character varying NOT NULL, "eh_npc" boolean NOT NULL DEFAULT false, "mapa_atual" character varying NOT NULL DEFAULT 'inicial', "dinheiro" numeric(10,2) NOT NULL DEFAULT '0', "ticket_continental" bigint NOT NULL DEFAULT '1', "ticket_regional" bigint NOT NULL DEFAULT '1', "sequencia_sem_errar" integer NOT NULL DEFAULT '0', "aparencias_equipadas" jsonb NOT NULL DEFAULT '[]', "roupa_abelha_id" uuid, "jogador_id" uuid, CONSTRAINT "REL_f35a4943e604dfbe2666bb5db0" UNIQUE ("roupa_abelha_id"), CONSTRAINT "PK_13c3bfa6498ea0a3d2e21111ef0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."progresso_desbloqueado_tipo_enum" AS ENUM('AREA', 'FASE', 'AEROPORTO', 'ONIBUS', 'APARENCIA', 'DIALOGO', 'CONQUISTA')`);
        await queryRunner.query(`CREATE TABLE "progresso_desbloqueado" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."progresso_desbloqueado_tipo_enum" NOT NULL, "identificador" character varying NOT NULL, "id_mapa" character varying NOT NULL, "desbloqueado_em" TIMESTAMP NOT NULL DEFAULT now(), "abelha_id" uuid, CONSTRAINT "UQ_0ec365d30b21ee94bc8ee559928" UNIQUE ("abelha_id", "tipo", "identificador"), CONSTRAINT "PK_fb42fced06ea65842b0964f47c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tentativas_fase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_fase" character varying NOT NULL, "id_mapa" character varying NOT NULL, "tentativas" integer NOT NULL, "erros" integer NOT NULL, "criada_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizada_em" TIMESTAMP NOT NULL DEFAULT now(), "abelha_id" uuid, CONSTRAINT "UQ_d308b3614e947bc1f77f3bc3dc3" UNIQUE ("abelha_id", "id_fase"), CONSTRAINT "PK_6fa83fd38c94638ec3b58f7d9fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_papel_enum" AS ENUM('dev', 'jogador')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" text NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "email_verified" boolean NOT NULL, "image" text, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "papel" "public"."user_papel_enum" NOT NULL DEFAULT 'jogador', "jogador_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_52d2ae4270bfb8abe27855b2ac" UNIQUE ("jogador_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" text NOT NULL, "account_id" text NOT NULL, "provider_id" text NOT NULL, "user_id" text NOT NULL, "access_token" text, "refresh_token" text, "id_token" text, "access_token_expires_at" TIMESTAMP, "refresh_token_expires_at" TIMESTAMP, "scope" text, "password" text, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" text NOT NULL, "expires_at" TIMESTAMP NOT NULL, "token" text NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "ip_address" text, "user_agent" text, "user_id" text NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verification" ("id" text NOT NULL, "identifier" text NOT NULL, "value" text NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP, "updated_at" TIMESTAMP, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_papel_enum" AS ENUM('dev', 'jogador')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_de_usuario" character varying NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "papel" "public"."usuarios_papel_enum" NOT NULL DEFAULT 'jogador', "jogador_id" uuid, CONSTRAINT "UQ_fb5912dd7f6322f8807d9bd028c" UNIQUE ("nome_de_usuario"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "REL_526b9027fc5a5d3f5e974698e6" UNIQUE ("jogador_id"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "roupas_desbloqueadas" ADD CONSTRAINT "FK_f8f3e968e2fd5e4d31618e7e759" FOREIGN KEY ("abelha_id") REFERENCES "abelhas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roupas_desbloqueadas" ADD CONSTRAINT "FK_22fa191e9369a53f91077aadac8" FOREIGN KEY ("roupa_abelha_id") REFERENCES "roupas_abelha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abelhas" ADD CONSTRAINT "FK_f35a4943e604dfbe2666bb5db00" FOREIGN KEY ("roupa_abelha_id") REFERENCES "roupas_abelha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abelhas" ADD CONSTRAINT "FK_e035c7e9b21db39c3af7b757dbd" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progresso_desbloqueado" ADD CONSTRAINT "FK_26a9e7ba317e295e0c983c9bc43" FOREIGN KEY ("abelha_id") REFERENCES "abelhas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tentativas_fase" ADD CONSTRAINT "FK_4e9566f1db36093257301cc407f" FOREIGN KEY ("abelha_id") REFERENCES "abelhas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_52d2ae4270bfb8abe27855b2acf" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "FK_526b9027fc5a5d3f5e974698e6a" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "FK_526b9027fc5a5d3f5e974698e6a"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_52d2ae4270bfb8abe27855b2acf"`);
        await queryRunner.query(`ALTER TABLE "tentativas_fase" DROP CONSTRAINT "FK_4e9566f1db36093257301cc407f"`);
        await queryRunner.query(`ALTER TABLE "progresso_desbloqueado" DROP CONSTRAINT "FK_26a9e7ba317e295e0c983c9bc43"`);
        await queryRunner.query(`ALTER TABLE "abelhas" DROP CONSTRAINT "FK_e035c7e9b21db39c3af7b757dbd"`);
        await queryRunner.query(`ALTER TABLE "abelhas" DROP CONSTRAINT "FK_f35a4943e604dfbe2666bb5db00"`);
        await queryRunner.query(`ALTER TABLE "roupas_desbloqueadas" DROP CONSTRAINT "FK_22fa191e9369a53f91077aadac8"`);
        await queryRunner.query(`ALTER TABLE "roupas_desbloqueadas" DROP CONSTRAINT "FK_f8f3e968e2fd5e4d31618e7e759"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_papel_enum"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_papel_enum"`);
        await queryRunner.query(`DROP TABLE "tentativas_fase"`);
        await queryRunner.query(`DROP TABLE "progresso_desbloqueado"`);
        await queryRunner.query(`DROP TYPE "public"."progresso_desbloqueado_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "abelhas"`);
        await queryRunner.query(`DROP TABLE "jogadores"`);
        await queryRunner.query(`DROP TABLE "roupas_desbloqueadas"`);
        await queryRunner.query(`DROP TABLE "roupas_abelha"`);
    }

}
