import { IsOptional, IsString } from 'class-validator';

export class CadastrarRoupaAbelhaDto {
  @IsString({ message: 'O caminho do rosto deve ser um texto' })
  @IsOptional()
  caminhoRosto?: string;

  @IsString({ message: 'O caminho das características deve ser um texto' })
  @IsOptional()
  caminhoCaracteristicas?: string;

  @IsString({ message: 'O caminho dos óculos deve ser um texto' })
  @IsOptional()
  caminhoOculos?: string;

  @IsString({ message: 'O caminho do corpo deve ser um texto' })
  @IsOptional()
  caminhoCorpo?: string;

  @IsString({ message: 'O caminho dos acessórios deve ser um texto' })
  @IsOptional()
  caminhoAcessorios?: string;

  @IsString({ message: 'O caminho do cabelo deve ser um texto' })
  @IsOptional()
  caminhoCabelo?: string;
}
