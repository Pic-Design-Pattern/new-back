import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DesbloquearPassagemOnibusDto {
  @IsString({ message: 'O id do ponto de ônibus deve ser um texto' })
  @IsNotEmpty({ message: 'O id do ponto de ônibus é obrigatório' })
  @MaxLength(50, { message: 'O id do ponto de ônibus deve ter no máximo 50 caracteres' })
  idPontoOnibus: string;

  @IsString({ message: 'O id do mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O id do mapa é obrigatório' })
  @MaxLength(50, { message: 'O id do mapa deve ter no máximo 50 caracteres' })
  idMapa: string;
}
