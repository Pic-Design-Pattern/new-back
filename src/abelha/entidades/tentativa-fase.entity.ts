import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AbelhaEntity } from './abelha.entity';

/**
 * Histórico de tentativas por fase: UM registro por (abelha, fase), acumulando `tentativas`
 * e `erros` de toda vez que aquela fase é jogada (idempotente, igual `ProgressoDesbloqueadoEntity`
 * — não é log de eventos). Reabrir a mesma fase em outra sessão SOMA nos totais existentes em vez
 * de criar uma linha nova, então "quantas vezes já tentei essa fase" sempre é 1 registro só.
 */
@Entity('tentativas_fase')
@Unique(['abelha', 'idFase'])
export class TentativaFaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AbelhaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'abelha_id' })
  abelha: AbelhaEntity;

  @Column({ name: 'id_fase', type: 'varchar' })
  idFase: string;

  @Column({ name: 'id_mapa', type: 'varchar' })
  idMapa: string;

  @Column({ type: 'int' })
  tentativas: number;

  @Column({ type: 'int' })
  erros: number;

  @CreateDateColumn({ name: 'criada_em' })
  criadaEm: Date;

  @UpdateDateColumn({ name: 'atualizada_em' })
  atualizadaEm: Date;
}
