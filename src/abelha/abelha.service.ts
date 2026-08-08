import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbelhaRepositoryToken } from './repositorios/abelha.repository';
import type { AbelhaRepository } from './repositorios/abelha.repository';
import { AbelhaEntity } from './entidades/abelha.entity';
import { RoupaAbelhaEntity } from './entidades/roupa-abelha.entity';
import { RoupaDesbloqueadaEntity } from './entidades/roupa-desbloqueada.entity';
import { CadastrarAbelhaInlineDto } from '../jogador/dtos/cadastrar-abelha-inline.dto';
import { JogadorEntity } from '../jogador/entidades/jogador.entity';

@Injectable()
export class AbelhaService {
  constructor(
    @Inject(AbelhaRepositoryToken)
    private readonly abelhaRepositorio: AbelhaRepository,

    @InjectRepository(RoupaDesbloqueadaEntity)
    private readonly roupaDesbloqueadaRepo: Repository<RoupaDesbloqueadaEntity>,

    @InjectRepository(RoupaAbelhaEntity)
    private readonly roupaAbelhaRepo: Repository<RoupaAbelhaEntity>,
  ) {}

  public async criarAbelha(
    dados: CadastrarAbelhaInlineDto,
    jogador?: JogadorEntity,
  ): Promise<AbelhaEntity> {
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
    if (jogador) novaAbelha.jogador = jogador;

    return this.abelhaRepositorio.salvar(novaAbelha);
  }

  async buscarPorId(id: string): Promise<AbelhaEntity | null> {
    return this.abelhaRepositorio.buscarPorId(id);
  }

  async removerAbelha(id: string): Promise<void> {
    return this.abelhaRepositorio.deletar(id);
  }

  public async buscarInformacoesAbelha(idAbelha: string) {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    return {
      mapaAtual: abelha.mapaAtual,
      dinheiro: abelha.dinheiro,
      ticketContinental: abelha.ticketContinental,
      ticketRegional: abelha.ticketRegional,
    };
  }

  public async adicionarDinheiro(
    idAbelha: string,
    valor: number,
  ): Promise<AbelhaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    abelha.dinheiro = Number(abelha.dinheiro) + valor;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async adicionarPassaporteContinental(
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    abelha.ticketContinental = Number(abelha.ticketContinental) + 1;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async adicionarPassaporteRegional(
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    abelha.ticketRegional = Number(abelha.ticketRegional) + 1;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async alterarMapaAtual(
    idAbelha: string,
    novoMapa: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    abelha.mapaAtual = novoMapa;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async listarRoupasDesbloqueadas(idAbelha: string) {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    return this.roupaDesbloqueadaRepo.find({
      where: { abelha: { id: idAbelha } },
      relations: { roupa: true },
    });
  }

  public async adicionarRoupaDesbloqueada(
    idAbelha: string,
    idRoupa: string,
    valorCompra: number,
    valorVenda: number,
  ): Promise<RoupaDesbloqueadaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    const roupa = await this.roupaAbelhaRepo.findOne({ where: { id: idRoupa } });

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
    idAbelha: string,
    idRoupaDesbloqueada: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    const roupaDesbloqueada = await this.roupaDesbloqueadaRepo.findOne({
      where: { id: idRoupaDesbloqueada, abelha: { id: idAbelha } },
    });

    if (!roupaDesbloqueada) {
      throw new NotFoundException('Roupa desbloqueada não encontrada no inventário desta abelha');
    }

    abelha.dinheiro = Number(abelha.dinheiro) + Number(roupaDesbloqueada.valorVenda);

    await this.roupaDesbloqueadaRepo.delete(idRoupaDesbloqueada);

    return this.abelhaRepositorio.salvar(abelha);
  }

  public async listarRoupaVestida(idAbelha: string) {
    const abelha = await this.abelhaRepositorio.buscarPorId(idAbelha);

    if (!abelha) {
      throw new NotFoundException('Abelha não encontrada');
    }

    return abelha.roupa ?? null;
  }
}

