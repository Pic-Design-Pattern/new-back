import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('session')
export class SessionEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'text' })
  token: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'ip_address', type: 'text', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
