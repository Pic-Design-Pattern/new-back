import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SenhaAdapter } from './senha.adapter';

@Injectable()
export class Argon2SenhaAdapter implements SenhaAdapter {
  private readonly logger = new Logger(Argon2SenhaAdapter.name);

  async criptografar(senhaPlana: string): Promise<string> {
    try {
      return await argon2.hash(senhaPlana);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Não foi possivel criptografar senha desejada!',
      );
    }
  }

  async comparar(
    senhaPlana: string,
    senhaCriptografada: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(senhaCriptografada, senhaPlana);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Credenciais Inválidas!');
    }
  }
}
