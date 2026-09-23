import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../auth/entidades/user.entity';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioRepositoryImplementation implements UsuarioRepository {
  private readonly logger = new Logger(UsuarioRepositoryImplementation.name);
  private readonly _usuarioRepository: Repository<UserEntity>;

  constructor(private readonly _typeORMDataSource: DataSource) {
    this._usuarioRepository = _typeORMDataSource.getRepository(UserEntity);
  }

  public async buscarPorEmail(email: string): Promise<UserEntity | null> {
    return this._usuarioRepository.findOne({
      where: { email },
      relations: {
        jogador: {
          abelhas: {
            roupa: true,
          }
        }
      },
    }).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar usuário por email!');
    });
  }

  public async buscarPorNomeDeUsuario(nomeDeUsuario: string): Promise<UserEntity | null> {
    return this._usuarioRepository.findOne({ where: { name: nomeDeUsuario } }).catch((error) => {
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

  public async salvar(usuario: UserEntity): Promise<UserEntity> {
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
        await manager.update(UserEntity, usuarioId, {
          jogador: { id: jogadorId },
        } as any);
      })
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Erro ao vincular jogador ao usuário!');
      });
  }
}
