import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLICO_KEY } from '../../decorators/publico.decorator';
import { auth } from '../../../../auth/auth';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class AutenticadoGuard implements CanActivate {
  private readonly logger = new Logger(AutenticadoGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublico = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLICO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublico) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session || !session.user) {
        throw new UnauthorizedException('Sessão inválida ou expirada');
      }

      // Repassando os dados do usuário para a request
      request['usuario'] = session.user;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }
  }
}
