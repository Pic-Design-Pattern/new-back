import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Iniciando migração de usuários para o better-auth...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Busca todos os usuários antigos
    const usuarios = await queryRunner.query('SELECT * FROM usuarios');

    console.log(`Foram encontrados ${usuarios.length} usuários para migrar.`);

    for (const usuario of usuarios) {
      // Verifica se o usuário já existe na nova tabela
      const existe = await queryRunner.query('SELECT id FROM "user" WHERE email = $1', [usuario.email]);
      
      if (existe.length === 0) {
        // Insere na nova tabela user
        await queryRunner.query(
          `INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at, papel, jogador_id)
           VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6)`,
          [
            usuario.id,
            usuario.nome_de_usuario,
            usuario.email,
            true, // Define como verificado, pois já eram usuários ativos
            usuario.papel,
            usuario.jogador_id
          ]
        );

        // O better-auth armazena senhas usando a tabela account com provider = 'credential'
        const accountId = crypto.randomUUID(); // Gera um UUID para a conta
        await queryRunner.query(
          `INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [
            accountId,
            usuario.email, // Geralmente account_id no credential provider é o email ou id
            'credential',
            usuario.id,
            usuario.senha
          ]
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
