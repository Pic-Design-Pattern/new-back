import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PapelUsuario } from '../../common/enums/papel-usuario.enum';
import { JogadorEntity } from '../../jogador/entidades/jogador.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ name: 'email_verified', type: 'boolean' })
  emailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Campos adicionais específicos da nossa aplicação
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
