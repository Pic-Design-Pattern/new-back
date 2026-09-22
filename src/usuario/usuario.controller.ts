import {
  Controller,
  Get,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioLogado } from '../common/seguranca/decorators/usuario-logado.decorator';
import { ControllerResponse, ResponseFactory } from '../utils/response';

@Controller('/usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly responseFactory: ResponseFactory,
  ) {}


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
