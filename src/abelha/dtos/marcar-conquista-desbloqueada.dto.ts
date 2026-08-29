import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MarcarConquistaDesbloqueadaDto {
  @IsString({ message: 'O id da conquista deve ser um texto' })
  @IsNotEmpty({ message: 'O id da conquista é obrigatório' })
  @MaxLength(50, { message: 'O id da conquista deve ter no máximo 50 caracteres' })
  idConquista: string;

  @IsString({ message: 'O id do mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O id do mapa é obrigatório' })
  @MaxLength(50, { message: 'O id do mapa deve ter no máximo 50 caracteres' })
  idMapa: string;
}
