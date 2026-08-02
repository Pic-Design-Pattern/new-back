import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JogadorEntity } from './entidades/jogador.entity';
import { JogadorService } from './jogador.service';
import { JogadorController } from './jogador.controller';
import { JogadorRepositoryProvider } from './providers/jogador-repository.provider';
import { AbelhaModule } from '../abelha/abelha.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JogadorEntity]),
    AbelhaModule,
    forwardRef(() => UsuarioModule),
  ],
  controllers: [JogadorController],
  providers: [
    JogadorService,
    JogadorRepositoryProvider,
  ],
  exports: [JogadorService],
})
export class JogadorModule {}
