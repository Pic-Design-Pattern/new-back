import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoupaAbelhaEntity } from './roupa-abelha.entity';
import { JogadorEntity } from '../../jogador/entidades/jogador.entity';

@Entity('abelhas')
export class AbelhaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nome: string;

  @Column({ type: 'text', nullable: true })
  lore?: string;

  @Column({ type: 'varchar', nullable: true })
  tamanho?: string;

  @Column({ name: 'eh_npc', type: 'boolean', default: false })
  ehNpc: boolean;

  @Column({ name: 'mapa_atual', type: 'varchar', default: 'inicial' })
  mapaAtual: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  dinheiro: number;

  @Column({ name: 'ticket_continental', type: 'bigint', default: 1 })
  ticketContinental: number;

  @Column({ name: 'ticket_regional', type: 'bigint', default: 1 })
  ticketRegional: number;

  @OneToOne(() => RoupaAbelhaEntity, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'roupa_abelha_id' })
  roupa?: RoupaAbelhaEntity;

  @ManyToOne(() => JogadorEntity, (jogador) => jogador.abelhas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jogador_id' })
  jogador: JogadorEntity;
}
