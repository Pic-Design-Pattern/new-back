import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbelhaEntity } from '../../abelha/entidades/abelha.entity';

@Entity('jogadores')
export class JogadorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nome: string;

  @Column({ type: 'bigint', default: 1 })
  nivel: number;

  @OneToMany(() => AbelhaEntity, (abelha) => abelha.jogador, {
    eager: true,
    cascade: true,
  })
  abelhas: AbelhaEntity[];
}
