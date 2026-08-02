import { SetMetadata } from '@nestjs/common';

export const PermissoesNecessarias = (permissoes: Array<string>) =>
  SetMetadata('PERMISSOES', permissoes);
