import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsuarioService } from '../../../src/usuario/usuario.service';
import { UsuarioRepositoryToken } from '../../../src/usuario/repositorios/usuario.repository';

describe('UsuarioService', () => {
  let service: UsuarioService;

  const mockUsuarioRepository = {
    buscarPorEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: UsuarioRepositoryToken,
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('obterPerfil', () => {
    it('deve retornar o usuário sem a senha caso encontrado', async () => {
      const mockUsuario = {
        id: 'user-id',
        email: 'test@email.com',
        senha: 'senha123',
        papel: 'JOGADOR',
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(mockUsuario);

      const resultado = await service.obterPerfil('test@email.com');

      expect(mockUsuarioRepository.buscarPorEmail).toHaveBeenCalledWith('test@email.com');
      expect(resultado).not.toHaveProperty('senha');
      expect(resultado).toEqual({
        id: 'user-id',
        email: 'test@email.com',
        papel: 'JOGADOR',
      });
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(service.obterPerfil('naoexiste@email.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
