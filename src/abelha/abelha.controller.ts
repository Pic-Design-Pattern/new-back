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
}
