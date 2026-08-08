import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { AbelhaController } from '../../../src/abelha/abelha.controller';
import { AbelhaService } from '../../../src/abelha/abelha.service';
import { ResponseFactory } from '../../../src/utils/response';
import { AbelhaEntity } from '../../../src/abelha/entidades/abelha.entity';
import { RoupaAbelhaEntity } from '../../../src/abelha/entidades/roupa-abelha.entity';
import { RoupaDesbloqueadaEntity } from '../../../src/abelha/entidades/roupa-desbloqueada.entity';

const mockEmailUsuario = 'jogador@email.com';

const mockRoupaAbelha: RoupaAbelhaEntity = {
  id: 'roupa-uuid-1',
  caminhoRosto: '/assets/rosto1.png',
  caminhoCaracteristicas: '/assets/caract1.png',
  caminhoOculos: '/assets/oculos1.png',
  caminhoCorpo: '/assets/corpo1.png',
  caminhoAcessorios: '/assets/acessorios1.png',
  caminhoCabelo: '/assets/cabelo1.png',
};

const mockAbelha: AbelhaEntity = {
  id: 'abelha-uuid-1',
  nome: 'Belinha',
  lore: 'Uma abelha corajosa',
  tamanho: 'medio',
  ehNpc: false,
  mapaAtual: 'floresta',
  dinheiro: 150.5,
  ticketContinental: 3,
  ticketRegional: 2,
  roupa: mockRoupaAbelha,
  roupasDesbloqueadas: [],
  jogador: {} as any,
};

const mockRoupaDesbloqueada: RoupaDesbloqueadaEntity = {
  id: 'roupa-desb-uuid-1',
  abelha: mockAbelha,
  roupa: mockRoupaAbelha,
  valorCompra: 50.0,
  valorVenda: 25.0,
};

const mockInfoAbelha = {
  mapaAtual: 'floresta',
  dinheiro: 150.5,
  ticketContinental: 3,
  ticketRegional: 2,
};

// ── Mock do Service ──

const mockAbelhaService = {
  buscarInformacoesAbelha: jest.fn(),
  adicionarDinheiro: jest.fn(),
  adicionarPassaporteContinental: jest.fn(),
  adicionarPassaporteRegional: jest.fn(),
  alterarMapaAtual: jest.fn(),
  listarRoupasDesbloqueadas: jest.fn(),
  adicionarRoupaDesbloqueada: jest.fn(),
  venderRoupa: jest.fn(),
  listarRoupaVestida: jest.fn(),
};

describe('AbelhaController', () => {
  let controller: AbelhaController;
  let service: typeof mockAbelhaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbelhaController],
      providers: [
        { provide: AbelhaService, useValue: mockAbelhaService },
        ResponseFactory,
      ],
    }).compile();

    controller = module.get<AbelhaController>(AbelhaController);
    service = mockAbelhaService;
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ── buscarInformacoes ──

  describe('buscarInformacoes', () => {
    it('deve retornar as informações da abelha do usuário com sucesso', async () => {
      service.buscarInformacoesAbelha.mockResolvedValue(mockInfoAbelha);

      const resultado = await controller.buscarInformacoes(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(service.buscarInformacoesAbelha).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Informações da abelha obtidas com sucesso');
      expect(resultado.dados).toEqual(mockInfoAbelha);
    });

    it('deve propagar ForbiddenException quando a abelha pertencer a outro usuário (BOLA protection)', async () => {
      service.buscarInformacoesAbelha.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.buscarInformacoes('abelha-alheia', mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve propagar exceção quando a abelha não existir', async () => {
      service.buscarInformacoesAbelha.mockRejectedValue(
        new Error('Abelha não encontrada'),
      );

      await expect(
        controller.buscarInformacoes('id-inexistente', mockEmailUsuario),
      ).rejects.toThrow('Abelha não encontrada');
    });
  });

  // ── adicionarDinheiro ──

  describe('adicionarDinheiro', () => {
    it('deve adicionar dinheiro e retornar a abelha atualizada', async () => {
      const abelhaAtualizada = { ...mockAbelha, dinheiro: 200.5 };
      service.adicionarDinheiro.mockResolvedValue(abelhaAtualizada);

      const resultado = await controller.adicionarDinheiro(
        'abelha-uuid-1',
        { valor: 50.0 },
        mockEmailUsuario,
      );

      expect(service.adicionarDinheiro).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
        50.0,
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Dinheiro adicionado com sucesso');
      expect(resultado.dados).toEqual(abelhaAtualizada);
    });

    it('deve propagar ForbiddenException ao tentar adicionar dinheiro na abelha de outro jogador', async () => {
      service.adicionarDinheiro.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.adicionarDinheiro('abelha-alheia', { valor: 50.0 }, mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── adicionarPassaporteContinental ──

  describe('adicionarPassaporteContinental', () => {
    it('deve incrementar o passaporte continental e retornar a abelha', async () => {
      const abelhaAtualizada = { ...mockAbelha, ticketContinental: 4 };
      service.adicionarPassaporteContinental.mockResolvedValue(abelhaAtualizada);

      const resultado = await controller.adicionarPassaporteContinental(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(service.adicionarPassaporteContinental).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Passaporte continental adicionado com sucesso');
      expect(resultado.dados.ticketContinental).toBe(4);
    });

    it('deve propagar ForbiddenException quando a abelha não pertence ao usuário', async () => {
      service.adicionarPassaporteContinental.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.adicionarPassaporteContinental('abelha-alheia', mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── adicionarPassaporteRegional ──

  describe('adicionarPassaporteRegional', () => {
    it('deve incrementar o passaporte regional e retornar a abelha', async () => {
      const abelhaAtualizada = { ...mockAbelha, ticketRegional: 3 };
      service.adicionarPassaporteRegional.mockResolvedValue(abelhaAtualizada);

      const resultado = await controller.adicionarPassaporteRegional(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(service.adicionarPassaporteRegional).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Passaporte regional adicionado com sucesso');
      expect(resultado.dados.ticketRegional).toBe(3);
    });

    it('deve propagar ForbiddenException quando abelha não pertence ao usuário', async () => {
      service.adicionarPassaporteRegional.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.adicionarPassaporteRegional('abelha-alheia', mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── alterarMapaAtual ──

  describe('alterarMapaAtual', () => {
    it('deve alterar o mapa da abelha e retornar atualizado', async () => {
      const abelhaAtualizada = { ...mockAbelha, mapaAtual: 'deserto' };
      service.alterarMapaAtual.mockResolvedValue(abelhaAtualizada);

      const resultado = await controller.alterarMapaAtual(
        'abelha-uuid-1',
        { mapa: 'deserto' },
        mockEmailUsuario,
      );

      expect(service.alterarMapaAtual).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
        'deserto',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Mapa da abelha alterado com sucesso');
      expect(resultado.dados.mapaAtual).toBe('deserto');
    });

    it('deve propagar ForbiddenException quando abelha não pertence ao jogador', async () => {
      service.alterarMapaAtual.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.alterarMapaAtual('abelha-alheia', { mapa: 'deserto' }, mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── listarRoupasDesbloqueadas ──

  describe('listarRoupasDesbloqueadas', () => {
    it('deve retornar lista de roupas desbloqueadas com sucesso', async () => {
      const roupas = [mockRoupaDesbloqueada];
      service.listarRoupasDesbloqueadas.mockResolvedValue(roupas);

      const resultado = await controller.listarRoupasDesbloqueadas(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(service.listarRoupasDesbloqueadas).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Roupas desbloqueadas listadas com sucesso');
      expect(resultado.dados).toEqual(roupas);
    });

    it('deve retornar lista vazia quando não há roupas desbloqueadas', async () => {
      service.listarRoupasDesbloqueadas.mockResolvedValue([]);

      const resultado = await controller.listarRoupasDesbloqueadas(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(resultado.sucesso).toBe(true);
      expect(resultado.dados).toEqual([]);
    });

    it('deve propagar ForbiddenException ao tentar listar roupas de abelha alheia', async () => {
      service.listarRoupasDesbloqueadas.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.listarRoupasDesbloqueadas('abelha-alheia', mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── adicionarRoupaDesbloqueada ──

  describe('adicionarRoupaDesbloqueada', () => {
    it('deve adicionar roupa desbloqueada e retornar com status CREATED', async () => {
      service.adicionarRoupaDesbloqueada.mockResolvedValue(mockRoupaDesbloqueada);

      const resultado = await controller.adicionarRoupaDesbloqueada(
        'abelha-uuid-1',
        {
          idRoupa: 'roupa-uuid-1',
          valorCompra: 50.0,
          valorVenda: 25.0,
        },
        mockEmailUsuario,
      );

      expect(service.adicionarRoupaDesbloqueada).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
        'roupa-uuid-1',
        50.0,
        25.0,
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.CREATED);
      expect(resultado.mensagem).toBe('Roupa desbloqueada adicionada com sucesso');
      expect(resultado.dados).toEqual(mockRoupaDesbloqueada);
    });

    it('deve propagar ForbiddenException ao tentar adicionar roupa em abelha alheia', async () => {
      service.adicionarRoupaDesbloqueada.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.adicionarRoupaDesbloqueada(
          'abelha-alheia',
          { idRoupa: 'roupa-uuid-1', valorCompra: 50.0, valorVenda: 25.0 },
          mockEmailUsuario,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── venderRoupa ──

  describe('venderRoupa', () => {
    it('deve vender roupa, somar valor de venda no dinheiro e retornar abelha', async () => {
      const abelhaComDinheiro = { ...mockAbelha, dinheiro: 175.5 };
      service.venderRoupa.mockResolvedValue(abelhaComDinheiro);

      const resultado = await controller.venderRoupa(
        'abelha-uuid-1',
        'roupa-desb-uuid-1',
        mockEmailUsuario,
      );

      expect(service.venderRoupa).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
        'roupa-desb-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Roupa vendida com sucesso');
      expect(resultado.dados.dinheiro).toBe(175.5);
    });

    it('deve propagar ForbiddenException ao tentar vender roupa de abelha alheia', async () => {
      service.venderRoupa.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.venderRoupa('abelha-alheia', 'roupa-desb-1', mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── listarRoupaVestida ──

  describe('listarRoupaVestida', () => {
    it('deve retornar a roupa vestida pela abelha', async () => {
      service.listarRoupaVestida.mockResolvedValue(mockRoupaAbelha);

      const resultado = await controller.listarRoupaVestida(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(service.listarRoupaVestida).toHaveBeenCalledWith(
        mockEmailUsuario,
        'abelha-uuid-1',
      );
      expect(resultado.sucesso).toBe(true);
      expect(resultado.status).toBe(HttpStatus.OK);
      expect(resultado.mensagem).toBe('Roupa vestida obtida com sucesso');
      expect(resultado.dados).toEqual(mockRoupaAbelha);
    });

    it('deve retornar null quando a abelha não tem roupa vestida', async () => {
      service.listarRoupaVestida.mockResolvedValue(null);

      const resultado = await controller.listarRoupaVestida(
        'abelha-uuid-1',
        mockEmailUsuario,
      );

      expect(resultado.sucesso).toBe(true);
      expect(resultado.dados).toBeNull();
    });

    it('deve propagar ForbiddenException ao tentar listar roupa vestida de abelha alheia', async () => {
      service.listarRoupaVestida.mockRejectedValue(
        new ForbiddenException('Você não tem permissão para gerenciar esta abelha'),
      );

      await expect(
        controller.listarRoupaVestida('abelha-alheia', mockEmailUsuario),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

