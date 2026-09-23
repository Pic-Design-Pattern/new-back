import { UserEntity } from '../../auth/entidades/user.entity';

export const UsuarioRepositoryToken = Symbol('USUARIO_REPOSITORY');

export interface UsuarioRepository {
  buscarPorEmail(email: string): Promise<UserEntity | null>;
  buscarPorNomeDeUsuario(nomeDeUsuario: string): Promise<UserEntity | null>;
  existePorEmail(email: string): Promise<boolean>;
  salvar(usuario: UserEntity): Promise<UserEntity>;
  vincularJogador(usuarioId: string, jogadorId: string): Promise<void>;
}
