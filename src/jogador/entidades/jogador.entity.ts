import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbelhaEntity } from '../../abelha/entidades/abelha.entity';

/**
 * Entidade que representa um jogador no jogo.
 * Equivalente da PlayerEntity.java.
 *
 * Relacionamento OneToOne com AbelhaEntity (cada jogador tem uma abelha).
 * O inventário foi removido nesta migração parcial.
 */
@Entity('jogadores')
export class JogadorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nome: string;

  @Column({ type: 'bigint', default: 1 })
  nivel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  dinheiro: number;

  @Column({ name: 'comida_favorita', type: 'varchar' })
  comidaFavorita: string;

  @Column({ name: 'ticket_continental', type: 'bigint', default: 1 })
  ticketContinental: number;

  @Column({ name: 'ticket_regional', type: 'bigint', default: 1 })
  ticketRegional: number;

  @OneToOne(() => AbelhaEntity, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'abelha_id' })
  abelha: AbelhaEntity | null;
}
