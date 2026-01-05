-- ============================================
-- TABELAS DE HIERARQUIA E PERFIS (Base legal angolana)
-- RF04, RF05, RF06, RF07 - Gestão de Utilizadores e Perfis
-- ============================================

-- 1. PERFIL DE USUÁRIO (Conforme legislação angolana)
CREATE TABLE perfil_usuario (
    id SERIAL PRIMARY KEY,
    codigo_perfil VARCHAR(20) UNIQUE NOT NULL,
    nome_perfil VARCHAR(100) NOT NULL,
    nivel_hierarquico INTEGER NOT NULL, -- 1=Mais alto, 10=Mais baixo
    tipo_acesso VARCHAR(50) CHECK (tipo_acesso IN ('Estratégico', 'Tático', 'Tático-Operacional', 'Operacional')),
    
    -- Base legal
    fundamento_legal TEXT, -- Artigo/parágrafo que fundamenta o perfil
    responsabilidades TEXT, -- Responsabilidades conforme legislação
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE perfil_usuario IS 'Perfis de acesso conforme hierarquia institucional angolana';

-- 2. USUÁRIO DO SISTEMA
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    
    -- Identificação única
    numero_identificacao VARCHAR(50) UNIQUE, -- BI, passaporte, etc.
    tipo_identificacao VARCHAR(30) CHECK (tipo_identificacao IN ('BI', 'Passaporte', 'Cédula', 'Outro')),
    
    -- Dados pessoais
    nome_completo VARCHAR(200) NOT NULL,
    genero CHAR(1) CHECK (genero IN ('M', 'F', 'O')),
    data_nascimento DATE,
    nacionalidade VARCHAR(100) DEFAULT 'Angolana',
    naturalidade VARCHAR(100),
    provincia_nascimento VARCHAR(100),
    
    -- Contato
    telefone_principal VARCHAR(20),
    telefone_alternativo VARCHAR(20),
    email_pessoal VARCHAR(100),
    email_institucional VARCHAR(100),
    endereco_residencia TEXT,
    municipio_residencia VARCHAR(100),
    provincia_residencia VARCHAR(100),
    
    -- Dados profissionais
    cargo_institucional VARCHAR(150),
    categoria_funcional VARCHAR(100),
    data_admissao DATE,
    numero_contrato VARCHAR(50),
    
    -- Autenticação
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(50),
    ultimo_login TIMESTAMP,
    data_expiracao_conta DATE,
    tentativas_login INTEGER DEFAULT 0,
    bloqueado BOOLEAN DEFAULT false,
    motivo_bloqueio TEXT,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    suspenso BOOLEAN DEFAULT false,
    data_suspensao DATE,
    motivo_suspensao TEXT,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_eliminacao TIMESTAMP,
    
    CONSTRAINT ck_email_pessoal CHECK (email_pessoal IS NULL OR email_pessoal ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT ck_email_institucional CHECK (email_institucional IS NULL OR email_institucional ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 3. ASSOCIAÇÃO USUÁRIO-PERFIL
CREATE TABLE usuario_perfil (
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    perfil_id INTEGER NOT NULL REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    
    -- Contexto da associação
    unidade_organica_id INTEGER REFERENCES unidade_organica(id),
    departamento_id INTEGER REFERENCES departamento(id),
    curso_id INTEGER REFERENCES curso(id),
    
    -- Mandato (para cargos de direção)
    data_inicio_mandato DATE,
    data_fim_mandato DATE,
    despacho_nomeacao VARCHAR(100),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Auditoria
    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    
    PRIMARY KEY (usuario_id, perfil_id, unidade_organica_id, departamento_id, curso_id)
);

COMMENT ON TABLE usuario_perfil IS 'Associação de usuários a perfis com contexto organizacional';

-- 4. CATEGORIA DOCUMENTAL (Base legal)
CREATE TABLE categoria_documental (
    id SERIAL PRIMARY KEY,
    codigo_categoria VARCHAR(20) UNIQUE NOT NULL,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    prazo_conservacao INTEGER, -- Em anos
    destino_final VARCHAR(50) CHECK (destino_final IN ('Eliminação', 'Arquivo Permanente', 'Reavaliação')),
    
    -- Classificação legal
    classificacao_legal VARCHAR(50) CHECK (classificacao_legal IN ('Público', 'Restrito', 'Confidencial', 'Secreto')),
    fundamento_classificacao TEXT,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TIPO DOCUMENTO (Escopo do sistema)
CREATE TABLE tipo_documento (
    id SERIAL PRIMARY KEY,
    codigo_tipo VARCHAR(20) UNIQUE NOT NULL,
    nome_tipo VARCHAR(150) NOT NULL,
    descricao TEXT,
    
    -- Classificação
    categoria_documental_id INTEGER NOT NULL REFERENCES categoria_documental(id),
    area_aplicacao VARCHAR(50) CHECK (area_aplicacao IN ('Académico', 'Administrativo', 'Qualidade', 'Institucional', 'Pedagógico')),
    
    -- Template associado
    template_obrigatorio BOOLEAN DEFAULT false,
    numeracao_automatica BOOLEAN DEFAULT true,
    
    -- Validade
    prazo_validade INTEGER, -- Em dias
    exige_assinatura BOOLEAN DEFAULT true,
    exige_aprovacao BOOLEAN DEFAULT false,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true
);

-- 6. PERMISSÃO POR TIPO DOCUMENTAL (RF06)
CREATE TABLE permissao_documento (
    id SERIAL PRIMARY KEY,
    perfil_id INTEGER NOT NULL REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    tipo_documento_id INTEGER NOT NULL REFERENCES tipo_documento(id) ON DELETE CASCADE,
    
    -- Permissões específicas (Base legal)
    pode_criar BOOLEAN DEFAULT false,
    pode_visualizar BOOLEAN DEFAULT false,
    pode_editar BOOLEAN DEFAULT false,
    pode_eliminar BOOLEAN DEFAULT false,
    pode_aprovar BOOLEAN DEFAULT false,
    pode_assinatur BOOLEAN DEFAULT false,
    pode_arquivar BOOLEAN DEFAULT false,
    pode_exportar BOOLEAN DEFAULT false,
    
    -- Restrições hierárquicas
    restricao_unidade BOOLEAN DEFAULT false, -- Só na sua UO
    restricao_departamento BOOLEAN DEFAULT false, -- Só no seu departamento
    restricao_curso BOOLEAN DEFAULT false, -- Só no seu curso
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(perfil_id, tipo_documento_id)
);