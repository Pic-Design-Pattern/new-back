import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JogadorEntity } from '../entidades/jogador.entity';
import { JogadorRepository } from './jogador.repository';

@Injectable()
export class JogadorRepositoryImplementation implements JogadorRepository {
  private readonly logger = new Logger(JogadorRepositoryImplementation.name);
  private readonly _jogadorRepository: Repository<JogadorEntity>;

  constructor(private readonly _typeORMDataSource: DataSource) {
    this._jogadorRepository = _typeORMDataSource.getRepository(JogadorEntity);
  }

  public async salvar(jogador: JogadorEntity): Promise<JogadorEntity> {
    return this._typeORMDataSource
      .transaction(async (manager) => {
        return manager.save(jogador);
      })
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Erro ao salvar jogador!');
      });
  }

  public async buscarPorId(id: string): Promise<JogadorEntity | null> {
    return this._jogadorRepository.findOne({ where: { id } }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar jogador!');
    });
  }

  public async existePorId(id: string): Promise<boolean> {
    return this._jogadorRepository.existsBy({ id }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao verificar existência do jogador!');
    });
  }
}
