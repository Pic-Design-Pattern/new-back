import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AbelhaEntity } from '../entidades/abelha.entity';
import { AbelhaRepository } from './abelha.repository';

@Injectable()
export class AbelhaRepositoryImplementation implements AbelhaRepository {
  private readonly logger = new Logger(AbelhaRepositoryImplementation.name);
  private readonly _abelhaRepository: Repository<AbelhaEntity>;

  constructor(private readonly _typeORMDataSource: DataSource) {
    this._abelhaRepository = _typeORMDataSource.getRepository(AbelhaEntity);
  }

  public async salvar(abelha: AbelhaEntity): Promise<AbelhaEntity> {
    return this._typeORMDataSource
      .transaction(async (manager) => {
        return manager.save(abelha);
      })
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Erro ao salvar abelha!');
      });
  }

  public async buscarPorId(id: string): Promise<AbelhaEntity | null> {
    return this._abelhaRepository.findOne({ where: { id } }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar abelha!');
    });
  }

 public async existePorId(id: string): Promise<boolean> {
    return this._abelhaRepository.existsBy({ id }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao verificar existência da abelha!');
    });
  }
}
