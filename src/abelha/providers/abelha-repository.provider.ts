import { Provider } from '@nestjs/common';
import { AbelhaRepositoryToken } from '../repositorios/abelha.repository';
import { AbelhaRepositoryImplementation } from '../repositorios/abelha-repository-impl';

export const AbelhaRepositoryProvider: Provider = {
  provide: AbelhaRepositoryToken,
  useClass: AbelhaRepositoryImplementation,
};
