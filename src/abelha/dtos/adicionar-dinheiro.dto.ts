import { IsNumber, IsPositive } from 'class-validator';

export class AdicionarDinheiroDto {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor deve ser positivo' })
  valor: number;
}
