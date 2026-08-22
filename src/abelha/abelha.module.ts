import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbelhaEntity } from './entidades/abelha.entity';
import { RoupaAbelhaEntity } from './entidades/roupa-abelha.entity';
import { RoupaDesbloqueadaEntity } from './entidades/roupa-desbloqueada.entity';
import { ProgressoDesbloqueadoEntity } from './entidades/progresso-desbloqueado.entity';
import { AbelhaService } from './abelha.service';
import { AbelhaController } from './abelha.controller';
import { AbelhaRepositoryProvider } from './providers/abelha-repository.provider';
import { AbelhaRepositoryToken } from './repositorios/abelha.repository';
import { ResponseModule } from '../utils/response.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AbelhaEntity,
      RoupaAbelhaEntity,
      RoupaDesbloqueadaEntity,
      ProgressoDesbloqueadoEntity,
    ]),
    ResponseModule,
  ],
  controllers: [AbelhaController],
  providers: [AbelhaService, AbelhaRepositoryProvider],
  exports: [AbelhaService, AbelhaRepositoryToken],
})
export class AbelhaModule {}
