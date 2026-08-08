import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Max } from 'class-validator';

export class AdicionarRoupaDesbloqueadaDto {
  @IsUUID('4', { message: 'O id da roupa deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O id da roupa é obrigatório' })
  idRoupa: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor de compra deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor de compra deve ser positivo' })
  @Max(1000000, { message: 'O valor de compra máximo permitido é 1.000.000,00' })
  valorCompra: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor de venda deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor de venda deve ser positivo' })
  @Max(1000000, { message: 'O valor de venda máximo permitido é 1.000.000,00' })
  valorVenda: number;
}