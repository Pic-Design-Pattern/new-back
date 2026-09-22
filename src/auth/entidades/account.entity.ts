import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ name: 'account_id', type: 'text' })
  accountId: string;

  @Column({ name: 'provider_id', type: 'text' })
  providerId: string;

  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'access_token', type: 'text', nullable: true })
  accessToken: string | null;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ name: 'id_token', type: 'text', nullable: true })
  idToken: string | null;

  @Column({ name: 'access_token_expires_at', type: 'timestamp', nullable: true })
  accessTokenExpiresAt: Date | null;

  @Column({ name: 'refresh_token_expires_at', type: 'timestamp', nullable: true })
  refreshTokenExpiresAt: Date | null;

  @Column({ type: 'text', nullable: true })
  scope: string | null;

  @Column({ type: 'text', nullable: true })
  password: string | null;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
