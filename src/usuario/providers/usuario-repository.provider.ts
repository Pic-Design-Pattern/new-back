import { Provider } from '@nestjs/common';
import { UsuarioRepositoryToken } from '../repositorios/usuario.repository';
import { UsuarioRepositoryImplementation } from '../repositorios/usuario-repository-impl';

export const UsuarioRepositoryProvider: Provider = {
  provide: UsuarioRepositoryToken,
  useClass: UsuarioRepositoryImplementation,
};
