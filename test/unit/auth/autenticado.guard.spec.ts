import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AutenticadoGuard } from '../../../src/common/seguranca/autenticado/guards/autenticado.guard';
import { IS_PUBLICO_KEY } from '../../../src/common/seguranca/decorators/publico.decorator';
import { auth } from '../../../src/auth/auth';

jest.mock('../../../src/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn().mockImplementation((headers) => headers),
}));

describe('AutenticadoGuard', () => {
  let guard: AutenticadoGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticadoGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AutenticadoGuard>(AutenticadoGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('deve estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve permitir acesso a rotas públicas', async () => {
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const resultado = await guard.canActivate(mockContext);

    expect(resultado).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLICO_KEY, [
      mockContext.getHandler(),
      mockContext.getClass(),
    ]);
  });

  it('deve bloquear se a rota não for pública e a sessão for inválida', async () => {
    const mockRequest = {
      headers: {},
    };
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve permitir acesso e injetar o usuário se a rota não for pública mas a sessão for válida', async () => {
    const mockRequest = {
      headers: {},
      usuario: undefined,
    } as any;
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockSession = {
      user: { id: 'user-id', email: 'test@test.com' },
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(mockSession);

    const resultado = await guard.canActivate(mockContext);

    expect(resultado).toBe(true);
    expect(mockRequest.usuario).toEqual(mockSession.user);
  });

  it('deve lançar UnauthorizedException se ocorrer um erro inesperado no getSession', async () => {
    const mockRequest = {
      headers: {},
    };
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    (auth.api.getSession as unknown as jest.Mock).mockRejectedValue(new Error('DB falha'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
