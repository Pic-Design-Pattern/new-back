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

@Controller('jogador')
export class JogadorController {
  constructor(private readonly jogadorService: JogadorService) { }


  @Post('cadastrar')
  @HttpCode(HttpStatus.CREATED)
  public async cadastrar(
    @Body() dto: CadastrarJogadorDto,
    @UsuarioLogado('email') emailUsuario: string,
  ) {
    const jogador = await this.jogadorService.cadastrar(dto, emailUsuario);

    return {
      sucesso: true,
      mensagem: 'Jogador cadastrado com sucesso',
      status: HttpStatus.CREATED,
      dados: jogador,
    };
  }


  @Get('meu-perfil')
  public async meuPerfil(@UsuarioLogado('email') emailUsuario: string) {
    const jogador =
      await this.jogadorService.buscarPerfilDoUsuario(emailUsuario);

    return {
      sucesso: true,
      mensagem: 'Perfil do jogador obtido com sucesso',
      status: HttpStatus.OK,
      dados: jogador,
    };
  }
}
