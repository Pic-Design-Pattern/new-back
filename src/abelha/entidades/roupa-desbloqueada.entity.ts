import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbelhaEntity } from './abelha.entity';
import { RoupaAbelhaEntity } from './roupa-abelha.entity';

@Entity('roupas_desbloqueadas')
export class RoupaDesbloqueadaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AbelhaEntity, (abelha) => abelha.roupasDesbloqueadas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'abelha_id' })
  abelha: AbelhaEntity;

  @ManyToOne(() => RoupaAbelhaEntity, { eager: true })
  @JoinColumn({ name: 'roupa_abelha_id' })
  roupa: RoupaAbelhaEntity;

  @Column({ name: 'valor_compra', type: 'decimal', precision: 10, scale: 2 })
  valorCompra: number;

  @Column({ name: 'valor_venda', type: 'decimal', precision: 10, scale: 2 })
  valorVenda: number;
}
