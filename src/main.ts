import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ExcecaoNegocioFilter } from './common/filtros/excecao-negocio.filter';

const origensString = process.env.CORS_ORIGIN || 'http://localhost:3001';
const origensPermitidas = origensString
  .split(',')
  .map((origin) => origin.trim());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configurações do CORS
  app.enableCors({
    origin: origensPermitidas,
    methods: 'GET,PUT,POST,DELETE,HEAD,PATCH',
    credentials: true,
  });

  //Configuração do Helmet, voltado para segurança
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  //Configuração de Validações globais
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Filtro global de exceções (formato padronizado de erro)
  app.useGlobalFilters(new ExcecaoNegocioFilter());

  //Prefixo global da API
  app.setGlobalPrefix('api');

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`Servidor rodando em http://localhost:${porta}/api`);
}

bootstrap();
