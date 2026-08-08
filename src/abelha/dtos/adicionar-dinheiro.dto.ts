import { IsNumber, IsPositive, Max } from 'class-validator';

export class AdicionarDinheiroDto {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor deve ser positivo' })
  @Max(1000000, { message: 'O valor máximo permitido por transação é 1.000.000,00' })
  valor: number;
}

