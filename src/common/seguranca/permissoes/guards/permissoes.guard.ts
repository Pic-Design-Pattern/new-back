import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class PermissoesGuard implements CanActivate {
  private readonly logger = new Logger(PermissoesGuard.name);
  private readonly secretJwt: string;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.secretJwt = this.configService.getOrThrow('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & any>();
    const permissoes =
      this.reflector.get<string[]>('PERMISSOES', context.getHandler()) || [];
    const token = this.extrairTokenDoHeader(request);

    if (permissoes.length === 0) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.secretJwt,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    try {
      const permissoesDoUsuario: string[] =
        payload.usuario?.permissoes || payload.permissoes || [];

      const temPermissao = this.validarSeUsuarioTemPermissoes(
        new Set(permissoesDoUsuario),
        permissoes,
      );

      if (!temPermissao) {
        throw new ForbiddenException('Permissões insuficientes');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(error);
      throw new ForbiddenException('Não foi possível validar permissões');
    }
  }

  private validarSeUsuarioTemPermissoes(
    permissoesDoUsuario: Set<string>,
    permissoesDaRota: string[],
  ): boolean {
    return permissoesDaRota.some((permissao) =>
      permissoesDoUsuario.has(permissao),
    );
  }

  private extrairTokenDoHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
