import { AbelhaEntity } from '../entidades/abelha.entity';

export const AbelhaRepositoryToken = Symbol('ABELHA_REPOSITORY');

export interface AbelhaRepository {
  salvar(abelha: AbelhaEntity): Promise<AbelhaEntity>;
  buscarPorId(id: string): Promise<AbelhaEntity | null>;
  existePorId(id: string): Promise<boolean>;
}
