-- ============================================================================
-- FEMABEE — script de criação do schema completo (idempotente)
-- Gerado a partir das entidades TypeORM em src/**/*.entity.ts, refletindo o
-- estado atual do jogo. Seguro de rodar contra um banco que já tem parte (ou
-- toda) a estrutura — cada tabela/tipo/coluna/constraint só é criada se ainda
-- não existir. Não altera nem apaga nada que já esteja lá.
--
-- Ordem das tabelas segue as dependências de FK:
--   jogadores, roupas_abelha  →  usuarios, abelhas  →  roupas_desbloqueadas,
--   progresso_desbloqueado, tentativas_fase
--
-- Rode como: psql "$DATABASE_URL" -f scripts/schema.sql
-- ============================================================================

-- uuid_generate_v4() é o que o TypeORM usa por padrão pra @PrimaryGeneratedColumn('uuid') no Postgres.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tipos enum ───────────────────────────────────────────────────────────────
-- Postgres não tem "CREATE TYPE IF NOT EXISTS" nativo — precisa checar pg_type manualmente.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usuarios_papel_enum') THEN
        CREATE TYPE usuarios_papel_enum AS ENUM ('dev', 'jogador');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'progresso_desbloqueado_tipo_enum') THEN
        CREATE TYPE progresso_desbloqueado_tipo_enum AS ENUM (
            'AREA', 'FASE', 'AEROPORTO', 'ONIBUS', 'APARENCIA', 'DIALOGO', 'CONQUISTA'
        );
    END IF;
END $$;

-- Se o tipo já existia de uma versão anterior do schema (antes de DIALOGO/CONQUISTA
-- existirem), adiciona os valores que estiverem faltando — ADD VALUE já é idempotente
-- por natureza via IF NOT EXISTS desde o Postgres 12.
ALTER TYPE progresso_desbloqueado_tipo_enum ADD VALUE IF NOT EXISTS 'DIALOGO';
ALTER TYPE progresso_desbloqueado_tipo_enum ADD VALUE IF NOT EXISTS 'CONQUISTA';

-- ── jogadores ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jogadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR NOT NULL,
    nivel BIGINT NOT NULL DEFAULT 1
);

-- ── roupas_abelha ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roupas_abelha (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caminho_rosto VARCHAR,
    caminho_caracteristicas VARCHAR,
    caminho_oculos VARCHAR,
    caminho_corpo VARCHAR,
    caminho_acessorios VARCHAR,
    caminho_cabelo VARCHAR
);

-- ── usuarios ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_de_usuario VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    senha VARCHAR NOT NULL,
    papel usuarios_papel_enum NOT NULL DEFAULT 'jogador',
    jogador_id UUID UNIQUE REFERENCES jogadores(id)
);

-- ── abelhas ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS abelhas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR NOT NULL,
    lore TEXT,
    tamanho VARCHAR,
    comida_favorita VARCHAR NOT NULL,
    eh_npc BOOLEAN NOT NULL DEFAULT false,
    mapa_atual VARCHAR NOT NULL DEFAULT 'inicial',
    dinheiro DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    ticket_continental BIGINT NOT NULL DEFAULT 1,
    ticket_regional BIGINT NOT NULL DEFAULT 1,
    sequencia_sem_errar INTEGER NOT NULL DEFAULT 0,
    aparencias_equipadas JSONB NOT NULL DEFAULT '[]',
    roupa_abelha_id UUID REFERENCES roupas_abelha(id),
    jogador_id UUID NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE
);

-- ── roupas_desbloqueadas ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roupas_desbloqueadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    abelha_id UUID NOT NULL REFERENCES abelhas(id) ON DELETE CASCADE,
    roupa_abelha_id UUID NOT NULL REFERENCES roupas_abelha(id),
    valor_compra DECIMAL(10, 2) NOT NULL,
    valor_venda DECIMAL(10, 2) NOT NULL
);

-- ── progresso_desbloqueado ───────────────────────────────────────────────────
-- Genérica (discriminada por "tipo"): áreas, fases, aeroportos, ônibus,
-- aparências, diálogos e conquistas desbloqueados — um registro idempotente
-- por (abelha, tipo, identificador).
CREATE TABLE IF NOT EXISTS progresso_desbloqueado (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    abelha_id UUID NOT NULL REFERENCES abelhas(id) ON DELETE CASCADE,
    tipo progresso_desbloqueado_tipo_enum NOT NULL,
    identificador VARCHAR NOT NULL,
    id_mapa VARCHAR NOT NULL,
    desbloqueado_em TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_progresso_desbloqueado_abelha_tipo_identificador UNIQUE (abelha_id, tipo, identificador)
);

-- ── tentativas_fase ──────────────────────────────────────────────────────────
-- Um registro por (abelha, fase), acumulando tentativas/erros a cada vez que
-- a fase é jogada — não é log de eventos, é idempotente.
CREATE TABLE IF NOT EXISTS tentativas_fase (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    abelha_id UUID NOT NULL REFERENCES abelhas(id) ON DELETE CASCADE,
    id_fase VARCHAR NOT NULL,
    id_mapa VARCHAR NOT NULL,
    tentativas INTEGER NOT NULL,
    erros INTEGER NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT now(),
    atualizada_em TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_tentativas_fase_abelha_fase UNIQUE (abelha_id, id_fase)
);
