import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CadastrarRoupaAbelhaDto } from '../../abelha/dtos/cadastrar-roupa-abelha.dto';

export class CadastrarAbelhaInlineDto {
  @IsString({ message: 'O nome da abelha deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da abelha é obrigatório' })
  @MaxLength(50, { message: 'O nome da abelha deve ter no máximo 50 caracteres' })
  nome: string;

  @IsString({ message: 'O tamanho da abelha deve ser um texto' })
  @MaxLength(50, { message: 'O tamanho da abelha deve ter no máximo 50 caracteres' })
  @IsOptional()
  tamanho?: string;

  @IsString({ message: 'A comida favorita deve ser um texto' })
  @IsNotEmpty({ message: 'A comida favorita é obrigatória' })
  @MaxLength(50, { message: 'A comida favorita deve ter no máximo 50 caracteres' })
  comidaFavorita: string;

  @ValidateNested({ message: 'Os dados da roupa são inválidos' })
  @IsOptional()
  @Type(() => CadastrarRoupaAbelhaDto)
  roupa?: CadastrarRoupaAbelhaDto;
}

