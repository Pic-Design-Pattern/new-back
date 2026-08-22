import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JogadorRepositoryToken } from './repositorios/jogador.repository';
import type { JogadorRepository } from './repositorios/jogador.repository';
import { AbelhaService } from '../abelha/abelha.service';
import { CadastrarJogadorDto } from './dtos/cadastrar-jogador.dto';
import { CadastrarAbelhaInlineDto } from './dtos/cadastrar-abelha-inline.dto';
import { JogadorEntity } from './entidades/jogador.entity';
import { UsuarioRepositoryToken } from 'src/usuario/repositorios/usuario.repository';
import type { UsuarioRepository } from 'src/usuario/repositorios/usuario.repository';
import { AbelhaEntity } from 'src/abelha/entidades/abelha.entity';

@Injectable()
export class JogadorService {
  constructor(
    @Inject(JogadorRepositoryToken)
    private readonly jogadorRepositorio: JogadorRepository,

    @Inject(UsuarioRepositoryToken)
    private readonly usuarioRepositorio: UsuarioRepository,

    private readonly abelhaService: AbelhaService,
  ) {}

  public async cadastrar(
    dto: CadastrarJogadorDto,
    emailUsuario: string,
  ): Promise<JogadorEntity> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(emailUsuario);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (usuario.jogador) {
      throw new ConflictException(
        'Este usuário já possui um jogador cadastrado',
      );
    }

    const novoJogador = new JogadorEntity();
    novoJogador.nome = dto.nome;
    novoJogador.nivel = 1;

    // A abelha só é construída aqui (não salva) — o jogador ainda não tem id pra
    // servir de FK. O cascade em JogadorEntity.abelhas salva os dois juntos, na
    // ordem certa, quando o jogador for salvo logo abaixo.
    const abelha = this.abelhaService.construirAbelha(dto.abelha);
    novoJogador.abelhas = [abelha];

    const jogadorSalvo = await this.jogadorRepositorio.salvar(novoJogador);
    await this.usuarioRepositorio.vincularJogador(usuario.id, jogadorSalvo.id);

    return jogadorSalvo;
  }

  public async buscarPerfilDoUsuario(
    emailUsuario: string,
  ): Promise<JogadorEntity> {
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

  public async cadastrarNovaAbelha(
    emailUsuario: string,
    dto: CadastrarAbelhaInlineDto,
  ): Promise<AbelhaEntity> {
    const jogador = await this.buscarPerfilDoUsuario(emailUsuario);

    if (jogador.abelhas && jogador.abelhas.length >= 3) {
      throw new BadRequestException(
        'O usuário já possui o limite máximo de 3 abelhas.',
      );
    }

    const novaAbelha = await this.abelhaService.criarAbelha(dto, jogador);
    return novaAbelha;
  }

  public async removerAbelha(
    emailUsuario: string,
    idAbelha: string,
  ): Promise<void> {
    const jogador = await this.buscarPerfilDoUsuario(emailUsuario);

    const abelhaPertenceAoJogador = jogador.abelhas?.some(
      (abelha) => abelha.id === idAbelha,
    );

    if (!abelhaPertenceAoJogador) {
      throw new NotFoundException('Abelha não encontrada no perfil do jogador');
    }

    await this.abelhaService.removerAbelha(idAbelha);
  }
}
