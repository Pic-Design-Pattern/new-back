import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JogadorService } from './jogador.service';
import { CadastrarJogadorDto } from './dtos/cadastrar-jogador.dto';
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
}
