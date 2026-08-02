import { Provider } from '@nestjs/common';
import { JogadorRepositoryToken } from '../repositorios/jogador.repository';
import { JogadorRepositoryImplementation } from '../repositorios/jogador-repository-impl';

export const JogadorRepositoryProvider: Provider = {
  provide: JogadorRepositoryToken,
  useClass: JogadorRepositoryImplementation,
};
