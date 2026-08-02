import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoupaAbelhaEntity } from './roupa-abelha.entity';

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

  @OneToOne(() => RoupaAbelhaEntity, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'roupa_abelha_id' })
  roupa?: RoupaAbelhaEntity;
}
