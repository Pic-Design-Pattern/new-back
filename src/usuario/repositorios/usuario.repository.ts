import { UsuarioEntity } from '../entidades/usuario.entity';

export const UsuarioRepositoryToken = Symbol('USUARIO_REPOSITORY');

export interface UsuarioRepository {
  buscarPorEmail(email: string): Promise<UsuarioEntity | null>;
  buscarPorNomeDeUsuario(nomeDeUsuario: string): Promise<UsuarioEntity | null>;
  existePorEmail(email: string): Promise<boolean>;
  salvar(usuario: UsuarioEntity): Promise<UsuarioEntity>;
  vincularJogador(usuarioId: string, jogadorId: string): Promise<void>;
}
