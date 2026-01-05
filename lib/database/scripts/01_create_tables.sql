-- ============================================
-- TABELAS ESTRUTURAIS DO SISTEMA
-- RF01, RF02, RF03 - Gestão Institucional
-- ============================================

-- 1. INSTITUIÇÃO (Base legal angolana)
CREATE TABLE instituicao (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(300) NOT NULL,
    sigla VARCHAR(20) NOT NULL,
    nuit VARCHAR(30) UNIQUE, -- NUIT angolano
    endereco_completo TEXT,
    municipio VARCHAR(100),
    provincia VARCHAR(100),
    telefone VARCHAR(20),
    email_institucional VARCHAR(100),
    logotipo_bytea BYTEA,
    logotipo_caminho VARCHAR(500),
    data_criacao DATE,
    licenca_operacao VARCHAR(100), -- Número da licença do MESCTI
    status_legal VARCHAR(50) DEFAULT 'Licenciada',
    
    -- Campos de controle
    criado_por INTEGER,
    data_criacao_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ck_email CHECK (email_institucional ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE instituicao IS 'Informações institucionais do ISPEKA conforme legislação angolana';
COMMENT ON COLUMN instituicao.nuit IS 'Número de Identificação Única de Trabalhador (Angola)';
COMMENT ON COLUMN instituicao.licenca_operacao IS 'Número da licença do Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI)';

-- 2. UNIDADE ORGÂNICA (Escolas/Faculdades)
CREATE TABLE unidade_organica (
    id SERIAL PRIMARY KEY,
    codigo_uo VARCHAR(10) UNIQUE NOT NULL, -- Ex: ESGT, FCA, etc.
    nome_uo VARCHAR(200) NOT NULL,
    sigla_uo VARCHAR(20),
    descricao TEXT,
    tipo_uo VARCHAR(50) CHECK (tipo_uo IN ('Escola', 'Faculdade', 'Instituto', 'Direção')),
    
    -- Diretor da Unidade Orgânica
    diretor_id INTEGER, -- Referência futura a docente
    mandato_inicio DATE,
    mandato_fim DATE,
    despacho_nomeacao VARCHAR(100), -- Número do despacho de nomeação
    
    -- Relacionamento institucional
    instituicao_id INTEGER NOT NULL REFERENCES instituicao(id),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_ativacao DATE DEFAULT CURRENT_DATE,
    data_desativacao DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEPARTAMENTO ACADÊMICO
CREATE TABLE departamento (
    id SERIAL PRIMARY KEY,
    codigo_dept VARCHAR(10) UNIQUE NOT NULL, -- Ex: DCT, DCE, etc.
    nome_dept VARCHAR(200) NOT NULL,
    sigla_dept VARCHAR(20),
    area_cientifica VARCHAR(150),
    
    -- Chefe do Departamento (Base legal: Chefe de Departamento)
    chefe_id INTEGER, -- Referência futura a docente
    mandato_inicio DATE,
    mandato_fim DATE,
    despacho_nomeacao VARCHAR(100),
    
    -- Estrutura organizacional
    unidade_organica_id INTEGER NOT NULL REFERENCES unidade_organica(id),
    instituicao_id INTEGER NOT NULL REFERENCES instituicao(id),
    
    -- Contato
    telefone_dept VARCHAR(20),
    email_dept VARCHAR(100),
    sala_localizacao VARCHAR(100),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_criacao DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CURSO (Base legal: cursos aprovados pelo MESCTI)
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    codigo_curso VARCHAR(20) UNIQUE NOT NULL, -- Código oficial MESCTI
    nome_curso VARCHAR(300) NOT NULL,
    grau_academico VARCHAR(100) CHECK (grau_academico IN ('Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Graduação')),
    regime VARCHAR(50) CHECK (regime IN ('Diurno', 'Pós-Laboral', 'Misto')),
    
    -- Dados académicos
    duracao_semestres INTEGER CHECK (duracao_semestres > 0),
    total_creditos INTEGER,
    area_cientifica VARCHAR(150),
    
    -- Coordenador (Base legal: Coordenador de Curso)
    coordenador_id INTEGER, -- Referência futura a docente
    vice_coordenador_id INTEGER,
    mandato_inicio DATE,
    mandato_fim DATE,
    
    -- Estrutura organizacional
    departamento_id INTEGER NOT NULL REFERENCES departamento(id),
    unidade_organica_id INTEGER NOT NULL REFERENCES unidade_organica(id),
    instituicao_id INTEGER NOT NULL REFERENCES instituicao(id),
    
    -- Aprovação legal
    despacho_aprovacao VARCHAR(100), -- Despacho de aprovação do MESCTI
    data_aprovacao DATE,
    numero_registro_mescti VARCHAR(50),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_inicio_funcionamento DATE,
    data_fim_funcionamento DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ANO ACADÉMICO (RF03)
CREATE TABLE ano_academico (
    id SERIAL PRIMARY KEY,
    ano VARCHAR(9) UNIQUE NOT NULL, -- Formato: 2024-2025
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    
    -- Parâmetros importantes
    data_matriculas_inicio DATE,
    data_matriculas_fim DATE,
    data_exames_especial DATE,
    data_encerramento DATE,
    
    -- Status
    ativo BOOLEAN DEFAULT false,
    encerrado BOOLEAN DEFAULT false,
    
    -- Deliberações
    deliberacao_abertura VARCHAR(100), -- Número da deliberação de abertura
    data_deliberacao DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ck_ano_formato CHECK (ano ~ '^\d{4}-\d{4}$'),
    CONSTRAINT ck_datas CHECK (data_fim > data_inicio)
);

-- 6. PERÍODO LETIVO
CREATE TABLE periodo_letivo (
    id SERIAL PRIMARY KEY,
    ano_academico_id INTEGER NOT NULL REFERENCES ano_academico(id),
    periodo VARCHAR(50) NOT NULL CHECK (periodo IN ('1º Semestre', '2º Semestre', 'Anual', 'Especial')),
    numero_periodo INTEGER CHECK (numero_periodo BETWEEN 1 AND 4),
    
    -- Datas do período
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    data_exames DATE,
    data_pautas DATE,
    
    -- Status
    ativo BOOLEAN DEFAULT false,
    encerrado BOOLEAN DEFAULT false,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(ano_academico_id, periodo)
);