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


@Controller('autenticacao')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Publico()
  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  async cadastrar(@Body() dto: CadastrarUsuarioDto) {
    await this.usuarioService.cadastrar(dto);

    return {
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso',
      status: HttpStatus.CREATED,
      dados: null,
    };
  }

  @Publico()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUsuarioDto) {
    const resultado = await this.usuarioService.login(dto);

    return {
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      status: HttpStatus.OK,
      dados: resultado,
    };
  }

  @Get('perfil')
  async perfil(@UsuarioLogado('email') email: string) {
    const usuario = await this.usuarioService.obterPerfil(email);

    return {
      sucesso: true,
      mensagem: 'Perfil obtido com sucesso',
      status: HttpStatus.OK,
      dados: usuario,
    };
  }
}
