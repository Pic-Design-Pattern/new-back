import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AbelhaEntity } from './abelha.entity';
import { TipoProgressoDesbloqueado } from './tipo-progresso-desbloqueado.enum';

/**
 * Progresso permanente da abelha: áreas (mapas/regiões) desbloqueadas, fases concluídas
 * 100%, aeroportos e pontos de ônibus desbloqueados. Uma tabela genérica (discriminada por
 * `tipo`) em vez de quatro quase idênticas — `identificador` é o id livre que o front usa
 * pra cada conceito (id do Mapa pra AREA, id da AcaoDoMapa pras outras três). Sem endpoint
 * de remoção: diferente de roupa, progresso não se "vende" de volta.
 */
@Entity('progresso_desbloqueado')
@Unique(['abelha', 'tipo', 'identificador'])
export class ProgressoDesbloqueadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AbelhaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'abelha_id' })
  abelha: AbelhaEntity;

  @Column({ type: 'enum', enum: TipoProgressoDesbloqueado })
  tipo: TipoProgressoDesbloqueado;

  @Column({ type: 'varchar' })
  identificador: string;

  /** Id do Mapa a que este registro pertence — pra AREA é igual a `identificador`; pras outras três, o mapa onde aquela AcaoDoMapa vive. Permite buscar tudo que já foi desbloqueado num mapa numa única query. */
  @Column({ name: 'id_mapa', type: 'varchar' })
  idMapa: string;

  @CreateDateColumn({ name: 'desbloqueado_em' })
  desbloqueadoEm: Date;
}
