import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './auth';
import { toNodeHandler } from 'better-auth/node';

const handler = toNodeHandler(auth);

@Controller('autenticacao')
export class AuthController {
  @All('/*')
  public async handleAuth(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }
}
