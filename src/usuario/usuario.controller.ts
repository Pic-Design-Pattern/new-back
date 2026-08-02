import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CadastrarUsuarioDto } from './dtos/cadastrar-usuario.dto';
import { LoginUsuarioDto } from './dtos/login-usuario.dto';
import { Publico } from '../common/seguranca/decorators/publico.decorator';
import { UsuarioLogado } from '../common/seguranca/decorators/usuario-logado.decorator';
import { ControllerResponse, ResponseFactory } from '../utils/response';


@Controller('autenticacao')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly responseFactory: ResponseFactory,
  ) {}

  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  async cadastrar(@Body() dto: CadastrarUsuarioDto) {
    await this.usuarioService.cadastrar(dto);

    return this.responseFactory.createCreatedResponse(
      undefined,
      'Usuário cadastrado com sucesso',
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUsuarioDto) {
    const resultado = await this.usuarioService.login(dto);

    return this.responseFactory.createSuccessResponse(
      resultado,
      'Login realizado com sucesso',
    );
  }

  @Get('perfil')
  async perfil(@UsuarioLogado('email') email: string) {
    const usuario = await this.usuarioService.obterPerfil(email);

    return this.responseFactory.createSuccessResponse(
      usuario,
      'Perfil obtido com sucesso',
    );
  }
}
