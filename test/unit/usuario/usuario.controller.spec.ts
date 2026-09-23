import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from '../../../src/usuario/usuario.controller';
import { UsuarioService } from '../../../src/usuario/usuario.service';
import { ResponseFactory } from '../../../src/utils/response';
import { HttpStatus } from '@nestjs/common';

describe('UsuarioController', () => {
  let controller: UsuarioController;

  const mockUsuarioService = {
    obterPerfil: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        ResponseFactory,
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('buscarInformacoesUsuarioLogado', () => {
    it('deve obter as informações com sucesso e retornar status OK', async () => {
      const mockUsuarioPerfil = {
        id: 'user-1',
        email: 'jogador@email.com',
        papel: 'JOGADOR',
      };

      mockUsuarioService.obterPerfil.mockResolvedValue(mockUsuarioPerfil);

      const resultado = await controller.buscarInformacoesUsuarioLogado(
        'jogador@email.com',
      );

      expect(mockUsuarioService.obterPerfil).toHaveBeenCalledWith(
        'jogador@email.com',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Perfil obtido com sucesso');
      expect(resultado.dados).toEqual(mockUsuarioPerfil);
    });

    it('deve propagar a exceção lançada pelo serviço (ex: NotFoundException)', async () => {
      mockUsuarioService.obterPerfil.mockRejectedValue(
        new Error('Usuário não encontrado'),
      );

      await expect(
        controller.buscarInformacoesUsuarioLogado('naoexiste@email.com'),
      ).rejects.toThrow('Usuário não encontrado');
    });
  });
});
