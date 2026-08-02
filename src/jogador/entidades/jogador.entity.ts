import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbelhaEntity } from '../../abelha/entidades/abelha.entity';

/**
 * Entidade que representa um jogador no jogo.
 * Equivalente da PlayerEntity.java.
 *
 * Relacionamento OneToMany com AbelhaEntity (cada jogador tem até 3 abelhas).
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

  @OneToMany(() => AbelhaEntity, (abelha) => abelha.jogador, {
    eager: true,
    cascade: true,
  })
  abelhas: AbelhaEntity[];
}
