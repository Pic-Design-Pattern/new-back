import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsuarioEntity } from '../entidades/usuario.entity';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioRepositoryImplementation implements UsuarioRepository {
  private readonly logger = new Logger(UsuarioRepositoryImplementation.name);
  private readonly _usuarioRepository: Repository<UsuarioEntity>;

  constructor(private readonly _typeORMDataSource: DataSource) {
    this._usuarioRepository = _typeORMDataSource.getRepository(UsuarioEntity);
  }

  public async buscarPorEmail(email: string): Promise<UsuarioEntity | null> {
    return this._usuarioRepository.findOne({
      where: { email },
      relations: {
        jogador: {
          abelha: {
            roupa: true,
          }
        }
      },
    }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar usuário por email!');
    });
  }

  public async buscarPorNomeDeUsuario(nomeDeUsuario: string): Promise<UsuarioEntity | null> {
    return this._usuarioRepository.findOne({ where: { nomeDeUsuario } }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar usuário por nome!');
    });
  }

  public async existePorEmail(email: string): Promise<boolean> {
    return this._usuarioRepository.existsBy({ email }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao verificar existência do usuário!');
    });
  }

  public async salvar(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    return this._typeORMDataSource
      .transaction(async (manager) => {
        return manager.save(usuario);
      })
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Erro ao salvar usuário!');
      });
  }

  public async vincularJogador(usuarioId: string, jogadorId: string): Promise<void> {
    await this._typeORMDataSource
      .transaction(async (manager) => {
        await manager.update(UsuarioEntity, usuarioId, {
          jogador: { id: jogadorId },
        } as any);
      })
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Erro ao vincular jogador ao usuário!');
      });
  }
}
