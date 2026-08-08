import { IsNotEmpty, IsString } from 'class-validator';

export class AlterarMapaDto {
  @IsString({ message: 'O mapa deve ser um texto' })
  @IsNotEmpty({ message: 'O mapa é obrigatório' })
  mapa: string;
}
