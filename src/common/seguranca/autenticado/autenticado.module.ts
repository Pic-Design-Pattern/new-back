import { Module } from '@nestjs/common';
import { AutenticadoGuard } from './guards/autenticado.guard';

@Module({
  imports: [],
  providers: [AutenticadoGuard],
  exports: [AutenticadoGuard],
})
export class AutenticadoModule {}
