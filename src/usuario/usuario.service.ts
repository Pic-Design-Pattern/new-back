import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioRepositoryToken } from './repositorios/usuario.repository';
import type { UsuarioRepository } from './repositorios/usuario.repository';
import { UsuarioEntity } from './entidades/usuario.entity';
import { PapelUsuario } from '../common/enums/papel-usuario.enum';

/**
 * Service responsável pelas operações de negócio do Usuário.
 */
@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepositoryToken)
    private readonly usuarioRepositorio: UsuarioRepository,
  ) {}
  public async obterPerfil(email: string): Promise<Omit<UsuarioEntity, 'senha'>> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(email);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}
