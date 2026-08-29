import {
  BadRequestException,
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
import { ProgressoDesbloqueadoEntity } from './entidades/progresso-desbloqueado.entity';
import { TipoProgressoDesbloqueado } from './entidades/tipo-progresso-desbloqueado.enum';
import { TentativaFaseEntity } from './entidades/tentativa-fase.entity';
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

    @InjectRepository(ProgressoDesbloqueadoEntity)
    private readonly progressoDesbloqueadoRepo: Repository<ProgressoDesbloqueadoEntity>,

    @InjectRepository(TentativaFaseEntity)
    private readonly tentativaFaseRepo: Repository<TentativaFaseEntity>,

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
    novaAbelha.comidaFavorita = dados.comidaFavorita;
    novaAbelha.ehNpc = false;
    novaAbelha.mapaAtual = 'inicial';
    novaAbelha.dinheiro = 0.0;
    novaAbelha.ticketContinental = 1;
    novaAbelha.ticketRegional = 1;
    novaAbelha.aparenciasEquipadas = [];
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
      sequenciaSemErrar: abelha.sequenciaSemErrar,
      tamanho: abelha.tamanho,
      aparenciasEquipadas: abelha.aparenciasEquipadas ?? [],
    };
  }

  public async incrementarSequenciaSemErrar(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    abelha.sequenciaSemErrar = Number(abelha.sequenciaSemErrar) + 1;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async resetarSequenciaSemErrar(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    abelha.sequenciaSemErrar = 0;
    return this.abelhaRepositorio.salvar(abelha);
  }

  /** Atualiza o que a abelha está usando agora (tamanho do corpo + aparências equipadas por slot). */
  public async atualizarEquipamento(
    emailUsuario: string,
    idAbelha: string,
    tamanho: string | undefined,
    aparenciasEquipadas: string[],
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    if (tamanho !== undefined) abelha.tamanho = tamanho;
    abelha.aparenciasEquipadas = aparenciasEquipadas;

    return this.abelhaRepositorio.salvar(abelha);
  }

  /** `valor` positivo credita, negativo debita — rejeita se o saldo ficaria negativo. */
  public async adicionarDinheiro(
    emailUsuario: string,
    idAbelha: string,
    valor: number,
  ): Promise<AbelhaEntity> {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.dataSource.transaction(async (manager) => {
      // findOne com lock pessimista quebra aqui: AbelhaEntity tem relações eager
      // (roupa, roupasDesbloqueadas) que viram LEFT JOIN, e o Postgres não aceita
      // "FOR UPDATE" no lado nullable de um outer join. O queryBuilder abaixo trava
      // só a linha da abelha, sem puxar essas relações.
      const abelha = await manager
        .createQueryBuilder(AbelhaEntity, 'abelha')
        .setLock('pessimistic_write')
        .where('abelha.id = :id', { id: idAbelha })
        .getOne();

      if (!abelha) {
        throw new NotFoundException('Abelha não encontrada');
      }

      const novoSaldo = Number(abelha.dinheiro) + valor;
      if (novoSaldo < 0) {
        throw new BadRequestException('Saldo insuficiente');
      }

      abelha.dinheiro = novoSaldo;
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

  public async gastarPassaporteContinental(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    if (Number(abelha.ticketContinental) <= 0) {
      throw new BadRequestException('Nenhuma passagem continental disponível');
    }

    abelha.ticketContinental = Number(abelha.ticketContinental) - 1;
    return this.abelhaRepositorio.salvar(abelha);
  }

  public async gastarPassaporteRegional(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<AbelhaEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    if (Number(abelha.ticketRegional) <= 0) {
      throw new BadRequestException('Nenhuma passagem regional disponível');
    }

    abelha.ticketRegional = Number(abelha.ticketRegional) - 1;
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

  // ── Progresso desbloqueado (áreas, fases, aeroportos, ônibus) ──

  private async listarProgresso(
    emailUsuario: string,
    idAbelha: string,
    tipo: TipoProgressoDesbloqueado,
  ): Promise<ProgressoDesbloqueadoEntity[]> {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.progressoDesbloqueadoRepo.find({
      where: { abelha: { id: idAbelha }, tipo },
      order: { desbloqueadoEm: 'ASC' },
    });
  }

  /** Idempotente: se a abelha já tinha esse item desbloqueado, retorna o registro existente em vez de duplicar. */
  private async desbloquearProgresso(
    emailUsuario: string,
    idAbelha: string,
    tipo: TipoProgressoDesbloqueado,
    identificador: string,
    idMapa: string,
  ): Promise<ProgressoDesbloqueadoEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    const existente = await this.progressoDesbloqueadoRepo.findOne({
      where: { abelha: { id: idAbelha }, tipo, identificador },
    });
    if (existente) return existente;

    const novoProgresso = new ProgressoDesbloqueadoEntity();
    novoProgresso.abelha = abelha;
    novoProgresso.tipo = tipo;
    novoProgresso.identificador = identificador;
    novoProgresso.idMapa = idMapa;

    return this.progressoDesbloqueadoRepo.save(novoProgresso);
  }

  public listarAreasDesbloqueadas(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.AREA);
  }

  public desbloquearArea(emailUsuario: string, idAbelha: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.AREA, idMapa, idMapa);
  }

  public listarFasesConcluidas(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.FASE);
  }

  public marcarFaseConcluida(emailUsuario: string, idAbelha: string, idFase: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.FASE, idFase, idMapa);
  }

  public listarAeroportosDesbloqueados(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.AEROPORTO);
  }

  public desbloquearAeroporto(emailUsuario: string, idAbelha: string, idAeroporto: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.AEROPORTO, idAeroporto, idMapa);
  }

  public listarPassagensOnibusDesbloqueadas(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.ONIBUS);
  }

  public desbloquearPassagemOnibus(emailUsuario: string, idAbelha: string, idPontoOnibus: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.ONIBUS, idPontoOnibus, idMapa);
  }

  /** Aparências (itens de customização) obtidas — por compra na loja ou como recompensa de fase. */
  public listarAparenciasDesbloqueadas(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.APARENCIA);
  }

  public desbloquearAparencia(emailUsuario: string, idAbelha: string, idAparencia: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.APARENCIA, idAparencia, idMapa);
  }

  /** Diálogos já exibidos — pra não repetir o mesmo diálogo (ex.: boas-vindas) a cada login. */
  public listarDialogosConcluidos(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.DIALOGO);
  }

  public marcarDialogoConcluido(emailUsuario: string, idAbelha: string, idDialogo: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.DIALOGO, idDialogo, idMapa);
  }

  /** Conquistas desbloqueadas — persistidas pra sobreviver a reload/login, em vez de reavaliadas só em memória. */
  public listarConquistasDesbloqueadas(emailUsuario: string, idAbelha: string) {
    return this.listarProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.CONQUISTA);
  }

  public marcarConquistaDesbloqueada(emailUsuario: string, idAbelha: string, idConquista: string, idMapa: string) {
    return this.desbloquearProgresso(emailUsuario, idAbelha, TipoProgressoDesbloqueado.CONQUISTA, idConquista, idMapa);
  }

  // ── Tentativas por fase (histórico + telemetria) ──

  /**
   * Registra um resumo de tentativas ao concluir (ou desistir de) uma fase. Idempotente por
   * (abelha, fase): se já existe um registro, SOMA nos totais existentes em vez de criar uma
   * linha nova — reabrir a mesma fase depois acumula no mesmo histórico, não duplica.
   */
  public async registrarTentativaFase(
    emailUsuario: string,
    idAbelha: string,
    idFase: string,
    idMapa: string,
    tentativas: number,
    erros: number,
  ): Promise<TentativaFaseEntity> {
    const abelha = await this.validarPosseAbelha(emailUsuario, idAbelha);

    const existente = await this.tentativaFaseRepo.findOne({
      where: { abelha: { id: idAbelha }, idFase },
    });

    if (existente) {
      existente.tentativas += tentativas;
      existente.erros += erros;
      existente.idMapa = idMapa;
      return this.tentativaFaseRepo.save(existente);
    }

    const registro = new TentativaFaseEntity();
    registro.abelha = abelha;
    registro.idFase = idFase;
    registro.idMapa = idMapa;
    registro.tentativas = tentativas;
    registro.erros = erros;

    return this.tentativaFaseRepo.save(registro);
  }

  /** Histórico pessoal de tentativas da abelha, uma linha por fase já jogada. */
  public async listarTentativasDaAbelha(emailUsuario: string, idAbelha: string) {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.tentativaFaseRepo.find({
      where: { abelha: { id: idAbelha } },
      order: { atualizadaEm: 'DESC' },
    });
  }

  /** Telemetria agregada de uma fase específica, entre TODAS as abelhas — não escopado a uma abelha. */
  public async buscarEstatisticasDaFase(idFase: string) {
    const registros = await this.tentativaFaseRepo.find({ where: { idFase } });

    const totalJogadas = registros.length;
    const totalTentativas = registros.reduce((soma, r) => soma + r.tentativas, 0);
    const totalErros = registros.reduce((soma, r) => soma + r.erros, 0);

    return {
      idFase,
      totalJogadas,
      mediaTentativas: totalJogadas ? totalTentativas / totalJogadas : 0,
      mediaErros: totalJogadas ? totalErros / totalJogadas : 0,
    };
  }

  /** Todo progresso (área, fases, aeroportos, ônibus) desbloqueado num mapa específico, numa única busca — usado ao abrir um mapa. */
  public async buscarProgressoDoMapa(
    emailUsuario: string,
    idAbelha: string,
    idMapa: string,
  ): Promise<ProgressoDesbloqueadoEntity[]> {
    await this.validarPosseAbelha(emailUsuario, idAbelha);

    return this.progressoDesbloqueadoRepo.find({
      where: { abelha: { id: idAbelha }, idMapa },
      order: { desbloqueadoEm: 'ASC' },
    });
  }
}
