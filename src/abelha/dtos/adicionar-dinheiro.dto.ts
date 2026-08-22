import { IsNumber, Max, Min, NotEquals } from 'class-validator';

export class AdicionarDinheiroDto {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com no máximo 2 casas decimais' },
  )
  @NotEquals(0, { message: 'O valor não pode ser zero' })
  @Min(-1000000, { message: 'O valor mínimo permitido por transação é -1.000.000,00' })
  @Max(1000000, { message: 'O valor máximo permitido por transação é 1.000.000,00' })
  valor: number;
}
