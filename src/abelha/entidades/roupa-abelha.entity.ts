import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roupas_abelha')
export class RoupaAbelhaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'caminho_rosto', type: 'varchar', nullable: true })
  caminhoRosto?: string;

  @Column({ name: 'caminho_caracteristicas', type: 'varchar', nullable: true })
  caminhoCaracteristicas?: string;

  @Column({ name: 'caminho_oculos', type: 'varchar', nullable: true })
  caminhoOculos?: string;

  @Column({ name: 'caminho_corpo', type: 'varchar', nullable: true })
  caminhoCorpo?: string;

  @Column({ name: 'caminho_acessorios', type: 'varchar', nullable: true })
  caminhoAcessorios?: string;

  @Column({ name: 'caminho_cabelo', type: 'varchar', nullable: true })
  caminhoCabelo?: string;
}
