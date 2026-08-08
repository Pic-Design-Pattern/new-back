import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CadastrarUsuarioDto {
  @IsString({ message: 'O nome de usuário deve ser um texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @MinLength(3, {
    message: 'O nome de usuário deve ter no mínimo 3 caracteres',
  })
  @MaxLength(50, {
    message: 'O nome de usuário deve ter no máximo 50 caracteres',
  })
  nomeDeUsuario: string;

  @IsEmail({}, { message: 'O email fornecido não é válido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.',
    },
  )
  @MaxLength(128, { message: 'A senha deve ter no máximo 128 caracteres' })
  senha: string;
}
