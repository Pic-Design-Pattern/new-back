import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticadoGuard } from './guards/autenticado.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          // `ConfigService.get` sempre retorna string (vem do .env) mesmo com o generic <number> —
          // passar essa string pro jsonwebtoken faz a lib `ms` interpretar um numeral sem unidade
          // (ex.: "3600") como MILISSEGUNDOS, não segundos, expirando o token quase na hora.
          // Convertendo pra number aqui, o jsonwebtoken trata como segundos corretamente.
          expiresIn: Number(configService.get<string>('JWT_EXPIRATION_TIME', '3600')),
        },
      }),
    }),
  ],
  providers: [AutenticadoGuard],
  exports: [AutenticadoGuard, JwtModule],
})
export class AutenticadoModule {}
