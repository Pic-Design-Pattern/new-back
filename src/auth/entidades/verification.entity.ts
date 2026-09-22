import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('verification')
export class VerificationEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text' })
  identifier: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
