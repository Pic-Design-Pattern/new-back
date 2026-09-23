import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const usuarios = await queryRunner.query('SELECT * FROM usuarios');

    console.log(`Foram encontrados ${usuarios.length} usuários para migrar.`);

    for (const usuario of usuarios) {
      const existe = await queryRunner.query(
        'SELECT id FROM "user" WHERE email = $1',
        [usuario.email],
      );

      if (existe.length === 0) {
        await queryRunner.query(
          `INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at, papel, jogador_id)
           VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6)`,
          [
            usuario.id,
            usuario.nome_de_usuario,
            usuario.email,
            true,
            usuario.papel,
            usuario.jogador_id,
          ],
        );

        const accountId = crypto.randomUUID();
        await queryRunner.query(
          `INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [accountId, usuario.email, 'credential', usuario.id, usuario.senha],
        );
      }
    }

    await queryRunner.commitTransaction();
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro na migração. Fazendo rollback...', error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

bootstrap();
