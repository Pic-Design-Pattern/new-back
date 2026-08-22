import { IsArray, IsOptional, IsString, MaxLength, ArrayMaxSize } from 'class-validator';

export class AtualizarEquipamentoDto {
  @IsOptional()
  @IsString({ message: 'O tamanho deve ser um texto' })
  @MaxLength(50, { message: 'O tamanho deve ter no máximo 50 caracteres' })
  tamanho?: string;

  @IsArray({ message: 'As aparências equipadas devem ser uma lista' })
  @ArrayMaxSize(20, { message: 'No máximo 20 aparências equipadas' })
  @IsString({ each: true, message: 'Cada aparência equipada deve ser um texto' })
  aparenciasEquipadas: string[];
}
