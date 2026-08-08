import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { AbelhaService } from './abelha.service';
import { ResponseFactory, ControllerResponse } from '../utils/response';
import { AdicionarDinheiroDto } from './dtos/adicionar-dinheiro.dto';
import { AlterarMapaDto } from './dtos/alterar-mapa.dto';

@Controller('/abelha')
export class AbelhaController {
  constructor(
    private readonly _abelhaService: AbelhaService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Get('/:idAbelha/info')
  public async buscarInformacoes(
    @Param('idAbelha') idAbelha: string,
  ): Promise<ControllerResponse> {
    const info = await this._abelhaService.buscarInformacoesAbelha(idAbelha);

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
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.adicionarDinheiro(
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
  ): Promise<ControllerResponse> {
    const abelha =
      await this._abelhaService.adicionarPassaporteContinental(idAbelha);

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Passaporte continental adicionado com sucesso',
    );
  }

  @Patch('/:idAbelha/passaporte-regional')
  @HttpCode(HttpStatus.OK)
  public async adicionarPassaporteRegional(
    @Param('idAbelha') idAbelha: string,
  ): Promise<ControllerResponse> {
    const abelha =
      await this._abelhaService.adicionarPassaporteRegional(idAbelha);

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Passaporte regional adicionado com sucesso',
    );
  }

  @Patch('/:idAbelha/mapa')
  @HttpCode(HttpStatus.OK)
  public async alterarMapaAtual(
    @Param('idAbelha') idAbelha: string,
    @Body() body: AlterarMapaDto,
  ): Promise<ControllerResponse> {
    const abelha = await this._abelhaService.alterarMapaAtual(
      idAbelha,
      body.mapa,
    );

    return this.responseFactory.createSuccessResponse(
      abelha,
      'Mapa da abelha alterado com sucesso',
    );
  }
}
