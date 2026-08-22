import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AbelhaService } from './abelha.service';
import { UsuarioLogado } from '../common/seguranca/decorators/usuario-logado.decorator';
import { ResponseFactory, ControllerResponse } from '../utils/response';
import { AdicionarDinheiroDto } from './dtos/adicionar-dinheiro.dto';
import { AlterarMapaDto } from './dtos/alterar-mapa.dto';
import { AdicionarRoupaDesbloqueadaDto } from './dtos/adicionar-roupa-desbloqueada.dto';
import { DesbloquearAreaDto } from './dtos/desbloquear-area.dto';
import { MarcarFaseConcluidaDto } from './dtos/marcar-fase-concluida.dto';
import { DesbloquearAeroportoDto } from './dtos/desbloquear-aeroporto.dto';
import { DesbloquearPassagemOnibusDto } from './dtos/desbloquear-passagem-onibus.dto';
import { DesbloquearAparenciaDto } from './dtos/desbloquear-aparencia.dto';
import { AtualizarEquipamentoDto } from './dtos/atualizar-equipamento.dto';

@Controller('/abelha')
export class AbelhaController {
  constructor(
    private readonly _abelhaService: AbelhaService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Get('/:idAbelha/info')
  public async buscarInformacoes(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const info = await this._abelhaService.buscarInformacoesAbelha(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      info,
      'Informações da abelha obtidas com sucesso',
    );
  }

  @Patch('/:idAbelha/dinheiro')
  @HttpCode(HttpStatus.OK)
  public async adicionarDinheiro(
    @Param('idAbelha') idAbelha: string,
    @Body() body: AdicionarDinheiroDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.adicionarDinheiro(
      emailUsuario,
      idAbelha,
      body.valor,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Dinheiro adicionado com sucesso',
    );
  }

  @Patch('/:idAbelha/passaporte-continental')
  @HttpCode(HttpStatus.OK)
  public async adicionarPassaporteContinental(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha =
      await this._abelhaService.adicionarPassaporteContinental(
        emailUsuario,
        idAbelha,
      );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Passaporte continental adicionado com sucesso',
    );
  }

  @Patch('/:idAbelha/passaporte-regional')
  @HttpCode(HttpStatus.OK)
  public async adicionarPassaporteRegional(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha =
      await this._abelhaService.adicionarPassaporteRegional(
        emailUsuario,
        idAbelha,
      );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Passaporte regional adicionado com sucesso',
    );
  }

  @Delete('/:idAbelha/passaporte-continental')
  @HttpCode(HttpStatus.OK)
  public async gastarPassaporteContinental(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.gastarPassaporteContinental(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Passaporte continental gasto com sucesso',
    );
  }

  @Delete('/:idAbelha/passaporte-regional')
  @HttpCode(HttpStatus.OK)
  public async gastarPassaporteRegional(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.gastarPassaporteRegional(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Passaporte regional gasto com sucesso',
    );
  }

  @Patch('/:idAbelha/equipamento')
  @HttpCode(HttpStatus.OK)
  public async atualizarEquipamento(
    @Param('idAbelha') idAbelha: string,
    @Body() body: AtualizarEquipamentoDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.atualizarEquipamento(
      emailUsuario,
      idAbelha,
      body.tamanho,
      body.aparenciasEquipadas,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Equipamento atualizado com sucesso',
    );
  }

  @Patch('/:idAbelha/mapa')
  @HttpCode(HttpStatus.OK)
  public async alterarMapaAtual(
    @Param('idAbelha') idAbelha: string,
    @Body() body: AlterarMapaDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.alterarMapaAtual(
      emailUsuario,
      idAbelha,
      body.mapa,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Mapa da abelha alterado com sucesso',
    );
  }

  @Get('/:idAbelha/roupas-desbloqueadas')
  public async listarRoupasDesbloqueadas(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const roupas = await this._abelhaService.listarRoupasDesbloqueadas(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      roupas,
      'Roupas desbloqueadas listadas com sucesso',
    );
  }

  @Post('/:idAbelha/roupas-desbloqueadas')
  @HttpCode(HttpStatus.CREATED)
  public async adicionarRoupaDesbloqueada(
    @Param('idAbelha') idAbelha: string,
    @Body() body: AdicionarRoupaDesbloqueadaDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const roupa = await this._abelhaService.adicionarRoupaDesbloqueada(
      emailUsuario,
      idAbelha,
      body.idRoupa,
      body.valorCompra,
      body.valorVenda,
    );

    return this.responseFactory.createCreatedResponse(
      roupa,
      'Roupa desbloqueada adicionada com sucesso',
    );
  }

  @Delete('/:idAbelha/roupas-desbloqueadas/:idRoupaDesbloqueada')
  @HttpCode(HttpStatus.OK)
  public async venderRoupa(
    @Param('idAbelha') idAbelha: string,
    @Param('idRoupaDesbloqueada') idRoupaDesbloqueada: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.venderRoupa(
      emailUsuario,
      idAbelha,
      idRoupaDesbloqueada,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Roupa vendida com sucesso',
    );
  }

  @Get('/:idAbelha/roupa-vestida')
  public async listarRoupaVestida(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const roupa = await this._abelhaService.listarRoupaVestida(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      roupa,
      'Roupa vestida obtida com sucesso',
    );
  }

  // ── Progresso desbloqueado (áreas, fases, aeroportos, ônibus) ──

  @Get('/:idAbelha/areas-desbloqueadas')
  public async listarAreasDesbloqueadas(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const areas = await this._abelhaService.listarAreasDesbloqueadas(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      areas,
      'Áreas desbloqueadas listadas com sucesso',
    );
  }

  @Post('/:idAbelha/areas-desbloqueadas')
  @HttpCode(HttpStatus.CREATED)
  public async desbloquearArea(
    @Param('idAbelha') idAbelha: string,
    @Body() body: DesbloquearAreaDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const area = await this._abelhaService.desbloquearArea(
      emailUsuario,
      idAbelha,
      body.idMapa,
    );

    return this.responseFactory.createCreatedResponse(
      area,
      'Área desbloqueada com sucesso',
    );
  }

  @Get('/:idAbelha/fases-concluidas')
  public async listarFasesConcluidas(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const fases = await this._abelhaService.listarFasesConcluidas(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      fases,
      'Fases concluídas listadas com sucesso',
    );
  }

  @Post('/:idAbelha/fases-concluidas')
  @HttpCode(HttpStatus.CREATED)
  public async marcarFaseConcluida(
    @Param('idAbelha') idAbelha: string,
    @Body() body: MarcarFaseConcluidaDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const fase = await this._abelhaService.marcarFaseConcluida(
      emailUsuario,
      idAbelha,
      body.idFase,
      body.idMapa,
    );

    return this.responseFactory.createCreatedResponse(
      fase,
      'Fase marcada como concluída com sucesso',
    );
  }

  @Get('/:idAbelha/aeroportos-desbloqueados')
  public async listarAeroportosDesbloqueados(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const aeroportos = await this._abelhaService.listarAeroportosDesbloqueados(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      aeroportos,
      'Aeroportos desbloqueados listados com sucesso',
    );
  }

  @Post('/:idAbelha/aeroportos-desbloqueados')
  @HttpCode(HttpStatus.CREATED)
  public async desbloquearAeroporto(
    @Param('idAbelha') idAbelha: string,
    @Body() body: DesbloquearAeroportoDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const aeroporto = await this._abelhaService.desbloquearAeroporto(
      emailUsuario,
      idAbelha,
      body.idAeroporto,
      body.idMapa,
    );

    return this.responseFactory.createCreatedResponse(
      aeroporto,
      'Aeroporto desbloqueado com sucesso',
    );
  }

  @Get('/:idAbelha/passagens-onibus-desbloqueadas')
  public async listarPassagensOnibusDesbloqueadas(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const passagens =
      await this._abelhaService.listarPassagensOnibusDesbloqueadas(
        emailUsuario,
        idAbelha,
      );

    return this.responseFactory.createSuccessResponse(
      passagens,
      'Passagens de ônibus desbloqueadas listadas com sucesso',
    );
  }

  @Post('/:idAbelha/passagens-onibus-desbloqueadas')
  @HttpCode(HttpStatus.CREATED)
  public async desbloquearPassagemOnibus(
    @Param('idAbelha') idAbelha: string,
    @Body() body: DesbloquearPassagemOnibusDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const passagem = await this._abelhaService.desbloquearPassagemOnibus(
      emailUsuario,
      idAbelha,
      body.idPontoOnibus,
      body.idMapa,
    );

    return this.responseFactory.createCreatedResponse(
      passagem,
      'Passagem de ônibus desbloqueada com sucesso',
    );
  }

  @Get('/:idAbelha/aparencias-desbloqueadas')
  public async listarAparenciasDesbloqueadas(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const aparencias = await this._abelhaService.listarAparenciasDesbloqueadas(
      emailUsuario,
      idAbelha,
    );

    return this.responseFactory.createSuccessResponse(
      aparencias,
      'Aparências desbloqueadas listadas com sucesso',
    );
  }

  @Post('/:idAbelha/aparencias-desbloqueadas')
  @HttpCode(HttpStatus.CREATED)
  public async desbloquearAparencia(
    @Param('idAbelha') idAbelha: string,
    @Body() body: DesbloquearAparenciaDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const aparencia = await this._abelhaService.desbloquearAparencia(
      emailUsuario,
      idAbelha,
      body.idAparencia,
      body.idMapa,
    );

    return this.responseFactory.createCreatedResponse(
      aparencia,
      'Aparência desbloqueada com sucesso',
    );
  }

  @Get('/:idAbelha/progresso-mapa/:idMapa')
  public async buscarProgressoDoMapa(
    @Param('idAbelha') idAbelha: string,
    @Param('idMapa') idMapa: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const progresso = await this._abelhaService.buscarProgressoDoMapa(
      emailUsuario,
      idAbelha,
      idMapa,
    );

    return this.responseFactory.createSuccessResponse(
      progresso,
      'Progresso do mapa obtido com sucesso',
    );
  }
}
