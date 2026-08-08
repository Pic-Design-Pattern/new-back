import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsuarioService } from './usuario.service';
import { CadastrarUsuarioDto } from './dtos/cadastrar-usuario.dto';
import { LoginUsuarioDto } from './dtos/login-usuario.dto';
import { UsuarioLogado } from '../common/seguranca/decorators/usuario-logado.decorator';
import { Publico } from '../common/seguranca/decorators/publico.decorator';
import { ControllerResponse, ResponseFactory } from '../utils/response';

@Controller('/autenticacao')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Publico()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async cadastrar(
    @Body() body: CadastrarUsuarioDto,
  ): Promise<ControllerResponse> {
    await this.usuarioService.cadastrar(body);

    return this.responseFactory.createCreatedResponse(
      undefined,
      'Usuário cadastrado com sucesso',
    );
  }

  @Publico()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() body: LoginUsuarioDto,
  ): Promise<ControllerResponse> {
    const resultado = await this.usuarioService.login(body);

    return this.responseFactory.createSuccessResponse(
      resultado,
      'Login realizado com sucesso',
    );
  }

  @Get('/perfil')
  public async buscarInformacoesUsuarioLogado(
    @UsuarioLogado('email') email: string,
  ): Promise<ControllerResponse> {
    const usuario = await this.usuarioService.obterPerfil(email);

    return this.responseFactory.createSuccessResponse(
      usuario,
      'Perfil obtido com sucesso',
    );
  }
}
