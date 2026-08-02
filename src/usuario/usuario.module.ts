import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entidades/usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioRepositoryProvider } from './providers/usuario-repository.provider';
import { SenhaAdapterProvider } from '../common/adapters/senha-adapter.provider';
import { AutenticadoModule } from '../common/seguranca/autenticado/autenticado.module';
import { UsuarioRepositoryToken } from './repositorios/usuario.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity]),
    AutenticadoModule,
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    UsuarioRepositoryProvider,
    SenhaAdapterProvider,
  ],
  exports: [UsuarioRepositoryToken],
})
export class UsuarioModule {}
