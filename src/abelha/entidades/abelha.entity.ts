import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoupaAbelhaEntity } from './roupa-abelha.entity';
import { RoupaDesbloqueadaEntity } from './roupa-desbloqueada.entity';
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

  @Column({ name: 'comida_favorita', type: 'varchar' })
  comidaFavorita: string;

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

  /** Fases seguidas concluídas sem nenhuma resposta errada — zera ao errar qualquer coisa. */
  @Column({ name: 'sequencia_sem_errar', type: 'int', default: 0 })
  sequenciaSemErrar: number;

  /** Ids das aparências (itens de loja) equipadas agora — um por slot/tipo, sem precisar duplicar o tipo aqui. */
  @Column({ name: 'aparencias_equipadas', type: 'jsonb', default: () => "'[]'" })
  aparenciasEquipadas: string[];

  @OneToOne(() => RoupaAbelhaEntity, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'roupa_abelha_id' })
  roupa?: RoupaAbelhaEntity;

  @OneToMany(() => RoupaDesbloqueadaEntity, (roupa) => roupa.abelha, {
    eager: true,
    cascade: true,
  })
  roupasDesbloqueadas: RoupaDesbloqueadaEntity[];

  @ManyToOne(() => JogadorEntity, (jogador) => jogador.abelhas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jogador_id' })
  jogador: JogadorEntity;
}
