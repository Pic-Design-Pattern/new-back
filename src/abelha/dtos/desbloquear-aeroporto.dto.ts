import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DesbloquearAeroportoDto {
  @IsString({ message: 'O id do aeroporto deve ser um texto' })
  @IsNotEmpty({ message: 'O id do aeroporto é obrigatório' })
  @MaxLength(50, { message: 'O id do aeroporto deve ter no máximo 50 caracteres' })
  idAeroporto: string;
}
