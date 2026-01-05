-- ============================================
-- SISTEMA INTEGRADO DE GESTÃO DOCUMENTAL
-- ISPEKA - Angola
-- Banco de dados PostgreSQL
-- ============================================

-- 1. CRIAR BANCO DE DADOS
CREATE DATABASE sigd_ispeka
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_PT.UTF-8'
    LC_CTYPE = 'pt_PT.UTF-8'
    CONNECTION LIMIT = 200;

COMMENT ON DATABASE sigd_ispeka IS 'Sistema Integrado de Gestão Documental do ISPEKA - Angola';

-- 2. CONECTAR AO BANCO
\c sigd_ispeka

-- 3. CRIAR EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. CRIAR SCHEMA PRINCIPAL
CREATE SCHEMA IF NOT EXISTS sigd;
SET search_path TO sigd, public;

-- 5. CRIAR ROLES (Base legal angolana)
CREATE ROLE direcao_geral WITH LOGIN PASSWORD 'Direcao@ISPEKA2024' CREATEDB;
CREATE ROLE chefe_departamento WITH LOGIN PASSWORD 'Chefe@Dept2024';
CREATE ROLE coordenador_curso WITH LOGIN PASSWORD 'Coordenador@2024';
CREATE ROLE docente WITH LOGIN PASSWORD 'Docente@ISPEKA2024';
CREATE ROLE secretaria WITH LOGIN PASSWORD 'Secretaria@2024';
CREATE ROLE qualidade WITH LOGIN PASSWORD 'Qualidade@2024';
CREATE ROLE sistema_admin WITH LOGIN PASSWORD 'Admin@SIGD2024' SUPERUSER;

-- 6. PERMISSÕES POR HIERARQUIA (Base legal)
GRANT CONNECT ON DATABASE sigd_ispeka TO 
    direcao_geral, chefe_departamento, coordenador_curso, 
    docente, secretaria, qualidade, sistema_admin;

GRANT USAGE ON SCHEMA sigd TO PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA sigd TO PUBLIC;