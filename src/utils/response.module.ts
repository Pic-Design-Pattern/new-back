import { Global, Module } from '@nestjs/common';
import { ResponseFactory } from './response';

@Global()
@Module({
  providers: [ResponseFactory],
  exports: [ResponseFactory],
})
export class ResponseModule {}
