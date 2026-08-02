import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PapelUsuario } from '../../common/enums/papel-usuario.enum';
import { JogadorEntity } from '../../jogador/entidades/jogador.entity';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome_de_usuario', type: 'varchar', unique: true })
  nomeDeUsuario: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  senha: string;

  @Column({
    type: 'enum',
    enum: PapelUsuario,
    default: PapelUsuario.JOGADOR,
  })
  papel: PapelUsuario;

  @OneToOne(() => JogadorEntity, {
    eager: true,
    nullable: true,
    cascade: false,
  })
  @JoinColumn({ name: 'jogador_id' })
  jogador: JogadorEntity | null;
}
