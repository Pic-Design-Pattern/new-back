import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CadastrarRoupaAbelhaDto {
  @IsString({ message: 'O caminho do rosto deve ser um texto' })
  @MaxLength(255, { message: 'O caminho do rosto deve ter no máximo 255 caracteres' })
  @IsOptional()
  caminhoRosto?: string;

  @IsString({ message: 'O caminho das características deve ser um texto' })
  @MaxLength(255, { message: 'O caminho das características deve ter no máximo 255 caracteres' })
  @IsOptional()
  caminhoCaracteristicas?: string;

  @IsString({ message: 'O caminho dos óculos deve ser um texto' })
  @MaxLength(255, { message: 'O caminho dos óculos deve ter no máximo 255 caracteres' })
  @IsOptional()
  caminhoOculos?: string;

  @IsString({ message: 'O caminho do corpo deve ser um texto' })
  @MaxLength(255, { message: 'O caminho do corpo deve ter no máximo 255 caracteres' })
  @IsOptional()
  caminhoCorpo?: string;

  @IsString({ message: 'O caminho dos acessórios deve ser um texto' })
  @MaxLength(255, { message: 'O caminho dos acessórios deve ter no máximo 255 caracteres' })
  @IsOptional()
  caminhoAcessorios?: string;

  @IsString({ message: 'O caminho do cabelo deve ser um texto' })
  @MaxLength(255, { message: 'O caminho do cabelo deve ter no máximo 255 caracteres' })
  @IsOptional()
  caminhoCabelo?: string;
}

