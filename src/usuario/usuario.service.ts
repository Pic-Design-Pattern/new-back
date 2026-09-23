import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioRepositoryToken } from './repositorios/usuario.repository';
import type { UsuarioRepository } from './repositorios/usuario.repository';
import { UserEntity } from '../auth/entidades/user.entity';

/**
 * Service responsável pelas operações de negócio do Usuário.
 */
@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepositoryToken)
    private readonly usuarioRepositorio: UsuarioRepository,
  ) {}
  public async obterPerfil(email: string): Promise<UserEntity> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(email);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }
}
