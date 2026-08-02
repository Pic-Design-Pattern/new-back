import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { JogadorService } from './jogador.service';
import { CadastrarJogadorDto } from './dtos/cadastrar-jogador.dto';
import { CadastrarAbelhaInlineDto } from './dtos/cadastrar-abelha-inline.dto';
import { UsuarioLogado } from '../common/seguranca/decorators/usuario-logado.decorator';
import { ControllerResponse, ResponseFactory } from '../utils/response';

@Controller('/jogador')
export class JogadorController {
  constructor(
    private readonly jogadorService: JogadorService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async cadastrar(
    @Body() dto: CadastrarJogadorDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const jogador = await this.jogadorService.cadastrar(dto, emailUsuario);

    return this.responseFactory.createCreatedResponse(
      jogador,
      'Jogador cadastrado com sucesso',
    );
  }

  @Get('/perfil')
  public async buscarPerfilDoUsuario(@UsuarioLogado('email') emailUsuario: string): Promise<ControllerResponse> {
    const jogador =
      await this.jogadorService.buscarPerfilDoUsuario(emailUsuario);

    return this.responseFactory.createSuccessResponse(
      jogador,
      'Perfil do jogador obtido com sucesso',
    );
  }

  @Post('/abelhas')
  @HttpCode(HttpStatus.CREATED)
  public async cadastrarNovaAbelha(
    @Body() dto: CadastrarAbelhaInlineDto,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    const novaAbelha = await this.jogadorService.cadastrarNovaAbelha(
      emailUsuario,
      dto,
    );

    return this.responseFactory.createCreatedResponse(
      novaAbelha,
      'Abelha cadastrada com sucesso',
    );
  }

  @Delete('/abelhas/:idAbelha')
  @HttpCode(HttpStatus.OK)
  public async removerAbelha(
    @Param('idAbelha') idAbelha: string,
    @UsuarioLogado('email') emailUsuario: string,
  ): Promise<ControllerResponse> {
    await this.jogadorService.removerAbelha(emailUsuario, idAbelha);

    return this.responseFactory.createSuccessResponse(
      undefined,
      'Abelha removida com sucesso',
    );
  }
}
