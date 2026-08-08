import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail({}, { message: 'O email fornecido não é válido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MaxLength(128, { message: 'A senha deve ter no máximo 128 caracteres' })
  senha: string;
}

