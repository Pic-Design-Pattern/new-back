import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';

export class RegistrarTentativaFaseDto {
  @IsString({ message: 'O id da fase deve ser um texto' })
  @IsNotEmpty({ message: 'O id da fase é obrigatório' })
  @MaxLength(50, { message: 'O id da fase deve ter no máximo 50 caracteres' })
  idFase: string;

  @IsString({ message: 'O id do mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O id do mapa é obrigatório' })
  @MaxLength(50, { message: 'O id do mapa deve ter no máximo 50 caracteres' })
  idMapa: string;

  @IsInt({ message: 'O total de tentativas deve ser um número inteiro' })
  @Min(0, { message: 'O total de tentativas não pode ser negativo' })
  tentativas: number;

  @IsInt({ message: 'O total de erros deve ser um número inteiro' })
  @Min(0, { message: 'O total de erros não pode ser negativo' })
  erros: number;
}
