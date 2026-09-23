import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './auth';
import { toNodeHandler } from 'better-auth/node';
import { Publico } from '../common/seguranca/decorators/publico.decorator';

const handler = toNodeHandler(auth);

@Publico()
@Controller('autenticacao')
export class AuthController {
  @All('/*')
  public async handleAuth(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }
}
