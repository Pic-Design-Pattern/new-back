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
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'pic'),
        autoLoadEntities: true,
        synchronize: false,
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
