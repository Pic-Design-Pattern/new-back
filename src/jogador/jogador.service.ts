import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JogadorRepositoryToken } from './repositorios/jogador.repository';
import type { JogadorRepository } from './repositorios/jogador.repository';
import { AbelhaService } from '../abelha/abelha.service';
import { CadastrarJogadorDto } from './dtos/cadastrar-jogador.dto';
import { JogadorEntity } from './entidades/jogador.entity';
import { UsuarioRepositoryToken } from 'src/usuario/repositorios/usuario.repository';
import type { UsuarioRepository } from 'src/usuario/repositorios/usuario.repository';


@Injectable()
export class JogadorService {
  constructor(
    @Inject(JogadorRepositoryToken)
    private readonly jogadorRepositorio: JogadorRepository,

    @Inject(UsuarioRepositoryToken)
    private readonly usuarioRepositorio: UsuarioRepository,

    private readonly abelhaService: AbelhaService,
  ) {}


  async cadastrar(
    dto: CadastrarJogadorDto,
    emailUsuario: string,
  ): Promise<JogadorEntity> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(emailUsuario);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (usuario.jogador) {
      throw new ConflictException('Este usuário já possui um jogador cadastrado');
    }

    const abelha = await this.abelhaService.criarAbelha(dto.abelha);

    const novoJogador = new JogadorEntity();
    novoJogador.nome = dto.nome;
    novoJogador.comidaFavorita = dto.comidaFavorita;
    novoJogador.nivel = 1;
    novoJogador.dinheiro = 0.0;
    novoJogador.ticketContinental = 1;
    novoJogador.ticketRegional = 1;
    novoJogador.abelha = abelha;

    const jogadorSalvo = await this.jogadorRepositorio.salvar(novoJogador);
    await this.usuarioRepositorio.vincularJogador(usuario.id, jogadorSalvo.id);

    return jogadorSalvo;
  }

  async buscarPerfilDoUsuario(emailUsuario: string): Promise<JogadorEntity> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(emailUsuario);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!usuario.jogador) {
      throw new NotFoundException(
        'Este usuário ainda não possui um jogador cadastrado',
      );
    }

    return usuario.jogador;
  }
}
