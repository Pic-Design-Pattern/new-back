import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepositoryToken } from './repositorios/usuario.repository';
import type { UsuarioRepository } from './repositorios/usuario.repository';
import { SenhaAdapterToken } from '../common/adapters/senha.adapter';
import type { SenhaAdapter } from '../common/adapters/senha.adapter';
import { CadastrarUsuarioDto } from './dtos/cadastrar-usuario.dto';
import { LoginUsuarioDto } from './dtos/login-usuario.dto';
import { UsuarioEntity } from './entidades/usuario.entity';
import { PapelUsuario } from '../common/enums/papel-usuario.enum';

/**
 * Service responsável pelas operações de negócio do Usuário.
 */
@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepositoryToken)
    private readonly usuarioRepositorio: UsuarioRepository,

    @Inject(SenhaAdapterToken)
    private readonly senhaAdapter: SenhaAdapter,

    private readonly jwtService: JwtService,
  ) {}

  public async cadastrar(dto: CadastrarUsuarioDto): Promise<void> {
    const emailExiste = await this.usuarioRepositorio.existePorEmail(dto.email);

    if (emailExiste) {
      throw new ConflictException('Já existe um usuário com este email');
    }

    const senhaCriptografada = await this.senhaAdapter.criptografar(dto.senha);

    const novoUsuario = new UsuarioEntity();
    novoUsuario.nomeDeUsuario = dto.nomeDeUsuario;
    novoUsuario.email = dto.email;
    novoUsuario.senha = senhaCriptografada;
    novoUsuario.papel = PapelUsuario.JOGADOR;
    
    await this.usuarioRepositorio.salvar(novoUsuario);
  }

  public async login(dto: LoginUsuarioDto): Promise<{ token: string }> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(dto.email);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const senhaValida = await this.senhaAdapter.comparar(
      dto.senha,
      usuario.senha,
    );

    if (!senhaValida) {
      throw new UnauthorizedException('Senha inválida');
    }

    const payloadToken = {
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
      nomeDeUsuario: usuario.nomeDeUsuario,
    };

    const token = await this.jwtService.signAsync(payloadToken);

    return { token };
  }


  public async obterPerfil(email: string): Promise<Omit<UsuarioEntity, 'senha'>> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(email);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}
