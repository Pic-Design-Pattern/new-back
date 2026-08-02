import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CadastrarRoupaAbelhaDto } from '../../abelha/dtos/cadastrar-roupa-abelha.dto';


export class CadastrarAbelhaInlineDto {
  @IsString({ message: 'O nome da abelha deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da abelha é obrigatório' })
  nome: string;

  @IsString({ message: 'O tamanho da abelha deve ser um texto' })
  @IsOptional()
  tamanho?: string;

  @ValidateNested({ message: 'Os dados da roupa são inválidos' })
  @IsOptional()
  @Type(() => CadastrarRoupaAbelhaDto)
  roupa?: CadastrarRoupaAbelhaDto;
}
