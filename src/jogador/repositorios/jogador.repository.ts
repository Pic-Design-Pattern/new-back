import { JogadorEntity } from '../entidades/jogador.entity';

export const JogadorRepositoryToken = Symbol('JOGADOR_REPOSITORY');

export interface JogadorRepository {
  salvar(jogador: JogadorEntity): Promise<JogadorEntity>;
  buscarPorId(id: string): Promise<JogadorEntity | null>;
  existePorId(id: string): Promise<boolean>;
}
