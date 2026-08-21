import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AbelhaRepositoryToken } from './repositorios/abelha.repository';
import type { AbelhaRepository } from './repositorios/abelha.repository';
import { AbelhaEntity } from './entidades/abelha.entity';
import { RoupaAbelhaEntity } from './entidades/roupa-abelha.entity';
import { RoupaDesbloqueadaEntity } from './entidades/roupa-desbloqueada.entity';
import { CadastrarAbelhaInlineDto } from '../jogador/dtos/cadastrar-abelha-inline.dto';
import { JogadorEntity } from '../jogador/entidades/jogador.entity';
import { UsuarioEntity } from '../usuario/entidades/usuario.entity';

@Injectable()
export class AbelhaService {
  constructor(
    @Inject(AbelhaRepositoryToken)
    private readonly abelhaRepositorio: AbelhaRepository,

    @InjectRepository(RoupaDesbloqueadaEntity)
    private readonly roupaDesbloqueadaRepo: Repository<RoupaDesbloqueadaEntity>,

    @InjectRepository(RoupaAbelhaEntity)
    private readonly roupaAbelhaRepo: Repository<RoupaAbelhaEntity>,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Monta a entidade em memória, sem salvar. Usado quando quem chama ainda vai
   * persistir a abelha junto de outra entidade (ex.: cascade ao salvar o Jogador
   * na primeira criação — salvar a abelha isoladamente antes falha porque o
   * jogador ainda não tem id pra servir de FK).
   */
  public construirAbelha(dados: CadastrarAbelhaInlineDto): AbelhaEntity {
    let roupa: Partial<RoupaAbelhaEntity> | null = null;

    if (dados.roupa) {
      roupa = {
        caminhoRosto: dados.roupa.caminhoRosto,
        caminhoCaracteristicas: dados.roupa.caminhoCaracteristicas,
        caminhoOculos: dados.roupa.caminhoOculos,
        caminhoCorpo: dados.roupa.caminhoCorpo,
        caminhoAcessorios: dados.roupa.caminhoAcessorios,
        caminhoCabelo: dados.roupa.caminhoCabelo,
      };
    }

    const novaAbelha = new AbelhaEntity();
    novaAbelha.nome = dados.nome;
    if (dados.tamanho) novaAbelha.tamanho = dados.tamanho;
    novaAbelha.ehNpc = false;
    novaAbelha.mapaAtual = 'inicial';
    novaAbelha.dinheiro = 0.0;
    novaAbelha.ticketContinental = 1;
    novaAbelha.ticketRegional = 1;
    if (roupa) novaAbelha.roupa = roupa as RoupaAbelhaEntity;

    return novaAbelha;
  }

  public async criarAbelha(
    dados: CadastrarAbelhaInlineDto,
    jogador: JogadorEntity,
  ): Promise<AbelhaEntity> {
    const novaAbelha = this.construirAbelha(dados);
    novaAbelha.jogador = jogador;

    return this.abelhaRepositorio.salvar(novaAbelha);
  }

  async removerAbelha(id: string): Promise<void> {
    return this.abelhaRepositorio.deletar(id);
  }

  public async validarPosseAbelha(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    const usuario = await this.dataSource.getRepository(UsuarioEntity).findOne({
      where: { email: emailUsuario },
      relations: { jogador: { abelhas: true } },
    });

    if (!usuario || !usuario.jogador) {
      throw new ForbiddenException('Usuário não possui jogador cadastrado');
    }

    const pertenceAoJogador = usuario.jogador.abelhas?.some(
      (a) => a.id === idAbelha,
    );

    if (!pertenceAoJogador) {
      throw new ForbiddenException(
        'Você não tem permissão para gerenciar esta abelha',
      );
    }

    return abelha;
  }

  public async buscarInformacoesAbelha(
    emailUsuario: string,
    idAbelha: string,
  ) {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    return {
      mapaAtual: abelha.mapaAtual,
      dinheiro: abelha.dinheiro,
      ticketContinental: abelha.ticketContinental,
      ticketRegional: abelha.ticketRegional,
    };
  }

  public async adicionarDinheiro(
    emailUsuario: string,
    idAbelha: string,
    valor: number,
  ): Promise<AbelhaEntity> {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.dataSource.transaction(async (manager) => {
      const abelha = await manager.findOne(AbelhaEntity, {
        where: { id: idAbelha },
        lock: { mode: 'pessimistic_write' },
      });

      if (!abelha) {
        throw new NotFoundException('Abelha não encontrada');
      }

      abelha.dinheiro = Number(abelha.dinheiro) + valor;
      return manager.save(AbelhaEntity, abelha);
    });
  }

  public async adicionarPassaporteContinental(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    abelha.ticketContinental = Number(abelha.ticketContinental) + 1;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async adicionarPassaporteRegional(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    abelha.ticketRegional = Number(abelha.ticketRegional) + 1;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async alterarMapaAtual(
    emailUsuario: string,
    idAbelha: string,
    novoMapa: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    abelha.mapaAtual = novoMapa;
    return this.abelhaRepositorio.salvar(abelha);
  }

  // ── Roupas Desbloqueadas ──

  public async listarRoupasDesbloqueadas(
    emailUsuario: string,
    idAbelha: string,
  ) {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.roupaDesbloqueadaRepo.find({
      where: { abelha: { id: idAbelha } },
      relations: { roupa: true },
    });
  }

  public async adicionarRoupaDesbloqueada(
    emailUsuario: string,
    idAbelha: string,
    idRoupa: string,
    valorCompra: number,
    valorVenda: number,
  ): Promise<RoupaDesbloqueadaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    const roupa = await this.roupaAbelhaRepo.findOne({
      where: { id: idRoupa },
    });

    if (!roupa) {
      throw new NotFoundException('Roupa não encontrada');
    }

    const roupaDesbloqueada = new RoupaDesbloqueadaEntity();
    roupaDesbloqueada.abelha = abelha;
    roupaDesbloqueada.roupa = roupa;
    roupaDesbloqueada.valorCompra = valorCompra;
    roupaDesbloqueada.valorVenda = valorVenda;

    return this.roupaDesbloqueadaRepo.save(roupaDesbloqueada);
  }

  public async venderRoupa(
    emailUsuario: string,
    idAbelha: string,
    idRoupaDesbloqueada: string,
  ): Promise<AbelhaEntity> {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.dataSource.transaction(async (manager) => {
      const abelha = await manager.findOne(AbelhaEntity, {
        where: { id: idAbelha },
        lock: { mode: 'pessimistic_write' },
      });

      if (!abelha) {
        throw new NotFoundException('Abelha não encontrada');
      }

      const roupaDesbloqueada = await manager.findOne(RoupaDesbloqueadaEntity, {
        where: { id: idRoupaDesbloqueada, abelha: { id: idAbelha } },
      });

      if (!roupaDesbloqueada) {
        throw new NotFoundException(
          'Roupa desbloqueada não encontrada no inventário desta abelha',
        );
      }

      abelha.dinheiro =
        Number(abelha.dinheiro) + Number(roupaDesbloqueada.valorVenda);

      await manager.delete(RoupaDesbloqueadaEntity, idRoupaDesbloqueada);
      return manager.save(AbelhaEntity, abelha);
    });
  }

  public async listarRoupaVestida(emailUsuario: string, idAbelha: string) {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);
    return abelha.roupa ?? null;
  }
}
