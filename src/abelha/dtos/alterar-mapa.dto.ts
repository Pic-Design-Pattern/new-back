import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AlterarMapaDto {
  @IsString({ message: 'O mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O mapa é obrigatório' })
  @MaxLength(50, { message: 'O nome do mapa deve ter no máximo 50 caracteres' })
  mapa: string;
}

