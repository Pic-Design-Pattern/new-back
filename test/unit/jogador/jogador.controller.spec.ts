import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JogadorController } from '../../../src/jogador/jogador.controller';
import { JogadorService } from '../../../src/jogador/jogador.service';
import { ResponseFactory } from '../../../src/utils/response';
import { JogadorEntity } from '../../../src/jogador/entidades/jogador.entity';
import { AbelhaEntity } from '../../../src/abelha/entidades/abelha.entity';
import { CadastrarJogadorDto } from '../../../src/jogador/dtos/cadastrar-jogador.dto';
import { CadastrarAbelhaInlineDto } from '../../../src/jogador/dtos/cadastrar-abelha-inline.dto';

// ── Dados Mock ──

const mockAbelha: AbelhaEntity = {
  id: 'abelha-uuid-1',
  nome: 'Belinha',
  lore: 'Uma abelha corajosa',
  tamanho: 'medio',
  ehNpc: false,
  mapaAtual: 'inicial',
  dinheiro: 0.0,
  ticketContinental: 1,
  ticketRegional: 1,
  roupa: undefined,
  roupasDesbloqueadas: [],
  jogador: {} as any,
};

const mockJogador: JogadorEntity = {
  id: 'jogador-uuid-1',
  nome: 'João',
  nivel: 1,
  comidaFavorita: 'mel',
  abelhas: [mockAbelha],
};

const mockCadastrarJogadorDto: CadastrarJogadorDto = {
  nome: 'João',
  comidaFavorita: 'mel',
  abelha: {
    nome: 'Belinha',
    tamanho: 'medio',
  } as CadastrarAbelhaInlineDto,
};

const mockCadastrarAbelhaDto: CadastrarAbelhaInlineDto = {
  nome: 'Mel',
  tamanho: 'grande',
};

// ── Mock do Service ──

const mockJogadorService = {
  cadastrar: jest.fn(),
  buscarPerfilDoUsuario: jest.fn(),
  cadastrarNovaAbelha: jest.fn(),
  removerAbelha: jest.fn(),
};

describe('JogadorController', () => {
  let controller: JogadorController;
  let service: typeof mockJogadorService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JogadorController],
      providers: [
        { provide: JogadorService, useValue: mockJogadorService },
        ResponseFactory,
      ],
    }).compile();

    controller = module.get<JogadorController>(JogadorController);
    service = mockJogadorService;
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ── cadastrar ──

  describe('cadastrar', () => {
    it('deve cadastrar um jogador com sucesso e retornar status CREATED', async () => {
      service.cadastrar.mockResolvedValue(mockJogador);

      const resultado = await controller.cadastrar(
        mockCadastrarJogadorDto,
        'jogador@email.com',
      );

      expect(service.cadastrar).toHaveBeenCalledWith(
        mockCadastrarJogadorDto,
        'jogador@email.com',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.CREATED);
      expect(resultado.mensagem).toBe('Jogador cadastrado com sucesso');
      expect(resultado.dados).toEqual(mockJogador);
    });

    it('deve propagar exceção quando o usuário não existe', async () => {
      service.cadastrar.mockRejectedValue(
        new Error('Usuário não encontrado'),
      );

      await expect(
        controller.cadastrar(mockCadastrarJogadorDto, 'naoexiste@email.com'),
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve propagar exceção quando o usuário já possui jogador', async () => {
      service.cadastrar.mockRejectedValue(
        new Error('Este usuário já possui um jogador cadastrado'),
      );

      await expect(
        controller.cadastrar(mockCadastrarJogadorDto, 'jogador@email.com'),
      ).rejects.toThrow('Este usuário já possui um jogador cadastrado');
    });
  });

  // ── buscarPerfilDoUsuario ──

  describe('buscarPerfilDoUsuario', () => {
    it('deve retornar o perfil do jogador com sucesso', async () => {
      service.buscarPerfilDoUsuario.mockResolvedValue(mockJogador);

      const resultado = await controller.buscarPerfilDoUsuario('jogador@email.com');

      expect(service.buscarPerfilDoUsuario).toHaveBeenCalledWith('jogador@email.com');
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Perfil do jogador obtido com sucesso');
      expect(resultado.dados).toEqual(mockJogador);
    });

    it('deve conter as abelhas do jogador no resultado', async () => {
      service.buscarPerfilDoUsuario.mockResolvedValue(mockJogador);

      const resultado = await controller.buscarPerfilDoUsuario('jogador@email.com');

      expect(resultado.dados.abelhas).toHaveLength(1);
      expect(resultado.dados.abelhas[0].nome).toBe('Belinha');
    });

    it('deve propagar exceção quando o usuário não existe', async () => {
      service.buscarPerfilDoUsuario.mockRejectedValue(
        new Error('Usuário não encontrado'),
      );

      await expect(
        controller.buscarPerfilDoUsuario('naoexiste@email.com'),
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve propagar exceção quando o usuário não tem jogador', async () => {
      service.buscarPerfilDoUsuario.mockRejectedValue(
        new Error('Este usuário ainda não possui um jogador cadastrado'),
      );

      await expect(
        controller.buscarPerfilDoUsuario('semjogador@email.com'),
      ).rejects.toThrow('Este usuário ainda não possui um jogador cadastrado');
    });
  });

  // ── cadastrarNovaAbelha ──

  describe('cadastrarNovaAbelha', () => {
    it('deve cadastrar nova abelha com sucesso e retornar status CREATED', async () => {
      const novaAbelha = { ...mockAbelha, id: 'abelha-uuid-2', nome: 'Mel' };
      service.cadastrarNovaAbelha.mockResolvedValue(novaAbelha);

      const resultado = await controller.cadastrarNovaAbelha(
        mockCadastrarAbelhaDto,
        'jogador@email.com',
      );

      expect(service.cadastrarNovaAbelha).toHaveBeenCalledWith(
        'jogador@email.com',
        mockCadastrarAbelhaDto,
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.CREATED);
      expect(resultado.mensagem).toBe('Abelha cadastrada com sucesso');
      expect(resultado.dados.nome).toBe('Mel');
    });

    it('deve propagar exceção quando jogador já tem 3 abelhas', async () => {
      service.cadastrarNovaAbelha.mockRejectedValue(
        new Error('O usuário já possui o limite máximo de 3 abelhas.'),
      );

      await expect(
        controller.cadastrarNovaAbelha(
          mockCadastrarAbelhaDto,
          'jogador@email.com',
        ),
      ).rejects.toThrow('O usuário já possui o limite máximo de 3 abelhas.');
    });
  });

  // ── removerAbelha ──

  describe('removerAbelha', () => {
    it('deve remover abelha com sucesso e retornar dados undefined', async () => {
      service.removerAbelha.mockResolvedValue(undefined);

      const resultado = await controller.removerAbelha(
        'abelha-uuid-1',
        'jogador@email.com',
      );

      expect(service.removerAbelha).toHaveBeenCalledWith(
        'jogador@email.com',
        'abelha-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Abelha removida com sucesso');
      expect(resultado.dados).toBeUndefined();
    });

    it('deve propagar exceção quando é a última abelha do jogador', async () => {
      service.removerAbelha.mockRejectedValue(
        new Error('O jogador deve ter pelo menos uma abelha.'),
      );

      await expect(
        controller.removerAbelha('abelha-uuid-1', 'jogador@email.com'),
      ).rejects.toThrow('O jogador deve ter pelo menos uma abelha.');
    });

    it('deve propagar exceção quando abelha não pertence ao jogador', async () => {
      service.removerAbelha.mockRejectedValue(
        new Error('Abelha não encontrada no perfil do jogador'),
      );

      await expect(
        controller.removerAbelha('abelha-outro-jogador', 'jogador@email.com'),
      ).rejects.toThrow('Abelha não encontrada no perfil do jogador');
    });
  });
});
