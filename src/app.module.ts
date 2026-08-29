import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticadoModule } from './common/seguranca/autenticado/autenticado.module';
import { AutenticadoGuard } from './common/seguranca/autenticado/guards/autenticado.guard';
import { UsuarioModule } from './usuario/usuario.module';
import { JogadorModule } from './jogador/jogador.module';
import { AbelhaModule } from './abelha/abelha.module';
import { ResponseModule } from './utils/response.module';
import { AbelhaEntity } from './abelha/entidades/abelha.entity';
import { ProgressoDesbloqueadoEntity } from './abelha/entidades/progresso-desbloqueado.entity';
import { RoupaAbelhaEntity } from './abelha/entidades/roupa-abelha.entity';
import { RoupaDesbloqueadaEntity } from './abelha/entidades/roupa-desbloqueada.entity';
import { JogadorEntity } from './jogador/entidades/jogador.entity';
import { UsuarioEntity } from './usuario/entidades/usuario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'Bloqueio-Geral',
          ttl: 60000,
          limit: 30,
          blockDuration: 10000,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST', 'localhost'),
        port: configService.getOrThrow<number>('DB_PORT', 5432),
        username: configService.getOrThrow<string>('DB_USERNAME', 'postgres'),
        password: configService.getOrThrow<string>('DB_PASSWORD', 'postgres'),
        database: configService.getOrThrow<string>('DB_DATABASE', 'pic'),
        synchronize: false,
        entities: [
          AbelhaEntity,
          RoupaAbelhaEntity,
          RoupaDesbloqueadaEntity,
          ProgressoDesbloqueadoEntity,
          JogadorEntity,
          UsuarioEntity
        ],
      }),
    }),
    AutenticadoModule,
    UsuarioModule,
    JogadorModule,
    AbelhaModule,
    ResponseModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AutenticadoGuard },
  ],
})
export class AppModule {}
