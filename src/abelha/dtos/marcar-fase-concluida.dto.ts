import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MarcarFaseConcluidaDto {
  @IsString({ message: 'O id da fase deve ser um texto' })
  @IsNotEmpty({ message: 'O id da fase é obrigatório' })
  @MaxLength(50, { message: 'O id da fase deve ter no máximo 50 caracteres' })
  idFase: string;

  @IsString({ message: 'O id do mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O id do mapa é obrigatório' })
  @MaxLength(50, { message: 'O id do mapa deve ter no máximo 50 caracteres' })
  idMapa: string;
}
