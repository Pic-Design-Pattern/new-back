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

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.CORS_ORIGIN || 'http://localhost:3000',
  basePath: '/api/autenticacao',
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
