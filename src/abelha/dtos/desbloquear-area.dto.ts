import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DesbloquearAreaDto {
  @IsString({ message: 'O id do mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O id do mapa é obrigatório' })
  @MaxLength(50, { message: 'O id do mapa deve ter no máximo 50 caracteres' })
  idMapa: string;
}
