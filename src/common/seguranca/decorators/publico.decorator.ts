import { SetMetadata } from '@nestjs/common';

export const IS_PUBLICO_KEY = 'isPublico';
export const Publico = () => SetMetadata(IS_PUBLICO_KEY, true);
