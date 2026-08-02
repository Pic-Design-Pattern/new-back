import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CadastrarAbelhaInlineDto } from './cadastrar-abelha-inline.dto';

/**
 * DTO para a segunda etapa do cadastro: criar jogador + abelha.
 */
export class CadastrarJogadorDto {
  @IsString({ message: 'O nome do jogador deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do jogador é obrigatório' })
  nome: string;

  @IsString({ message: 'A comida favorita deve ser um texto' })
  @IsNotEmpty({ message: 'A comida favorita é obrigatória' })
  comidaFavorita: string;

  @ValidateNested({ message: 'Os dados da abelha são inválidos' })
  @Type(() => CadastrarAbelhaInlineDto)
  abelha: CadastrarAbelhaInlineDto;
}
