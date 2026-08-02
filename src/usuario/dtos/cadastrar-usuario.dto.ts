import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CadastrarUsuarioDto {
  @IsString({ message: 'O nome de usuário deve ser um texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  nomeDeUsuario: string;

  @IsEmail({}, { message: 'O email fornecido não é válido' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;
}
