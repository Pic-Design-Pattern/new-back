import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class AdicionarRoupaDesbloqueadaDto {
  @IsUUID('4', { message: 'O id da roupa deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O id da roupa é obrigatório' })
  idRoupa: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor de compra deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor de compra deve ser positivo' })
  valorCompra: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor de venda deve ser um número com no máximo 2 casas decimais' },
  )
  @IsPositive({ message: 'O valor de venda deve ser positivo' })
  valorVenda: number;
}
