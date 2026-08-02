import { Provider } from '@nestjs/common';
import { SenhaAdapterToken } from './senha.adapter';
import { Argon2SenhaAdapter } from './argon2-senha.adapter';

export const SenhaAdapterProvider: Provider = {
  provide: SenhaAdapterToken,
  useClass: Argon2SenhaAdapter,
};
