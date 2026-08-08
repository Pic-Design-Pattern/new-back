import {
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CadastrarAbelhaInlineDto } from './cadastrar-abelha-inline.dto';

export class CadastrarJogadorDto {
  @IsString({ message: 'O nome do jogador deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do jogador é obrigatório' })
  @MaxLength(50, { message: 'O nome do jogador deve ter no máximo 50 caracteres' })
  nome: string;

  @IsString({ message: 'A comida favorita deve ser um texto' })
  @IsNotEmpty({ message: 'A comida favorita é obrigatória' })
  @MaxLength(50, { message: 'A comida favorita deve ter no máximo 50 caracteres' })
  comidaFavorita: string;

  @ValidateNested({ message: 'Os dados da abelha são inválidos' })
  @Type(() => CadastrarAbelhaInlineDto)
  abelha: CadastrarAbelhaInlineDto;
}

