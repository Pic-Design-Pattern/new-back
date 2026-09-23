import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'pic',
});

const origensString = process.env.CORS_ORIGIN || 'http://localhost:4200';
const trustedOriginsList = origensString
  .split(',')
  .map((origin) => origin.trim());

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
  basePath: '/api/autenticacao',
  trustedOrigins: trustedOriginsList,
  user: {
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  session: {
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      userId: 'user_id',
    },
  },
  account: {
    fields: {
      accountId: 'account_id',
      providerId: 'provider_id',
      userId: 'user_id',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      idToken: 'id_token',
    },
  },
  verification: {
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'no-reply@femabee.online',
        to: user.email,
        subject: 'Confirme seu endereço de e-mail',
        html: `<p>Olá ${user.name},</p><p>Clique no link abaixo para confirmar seu e-mail:</p><p><a href="${url}">${url}</a></p>`,
      });
    },
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'no-reply@femabee.online',
        to: user.email,
        subject: 'Redefinição de Senha',
        html: `<p>Olá ${user.name},</p><p>Clique no link abaixo para redefinir sua senha:</p><p><a href="${url}">${url}</a></p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
