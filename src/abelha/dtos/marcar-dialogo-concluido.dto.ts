import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MarcarDialogoConcluidoDto {
  @IsString({ message: 'O id do diálogo deve ser um texto' })
  @IsNotEmpty({ message: 'O id do diálogo é obrigatório' })
  @MaxLength(50, { message: 'O id do diálogo deve ter no máximo 50 caracteres' })
  idDialogo: string;

  @IsString({ message: 'O id do mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O id do mapa é obrigatório' })
  @MaxLength(50, { message: 'O id do mapa deve ter no máximo 50 caracteres' })
  idMapa: string;
}
