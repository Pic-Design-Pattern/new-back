import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbelhaEntity } from './entidades/abelha.entity';
import { RoupaAbelhaEntity } from './entidades/roupa-abelha.entity';
import { AbelhaService } from './abelha.service';
import { AbelhaRepositoryProvider } from './providers/abelha-repository.provider';
import { AbelhaRepositoryToken } from './repositorios/abelha.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AbelhaEntity, RoupaAbelhaEntity])],
  providers: [
    AbelhaService,
    AbelhaRepositoryProvider,
  ],
  exports: [AbelhaService, AbelhaRepositoryToken],
})
export class AbelhaModule {}
