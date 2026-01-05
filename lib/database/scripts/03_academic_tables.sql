-- ============================================
-- TABELAS ACADÊMICAS (Integração com sistema existente)
-- RF08, RF09, RF10, RF11 - Integração com Sistema Académico
-- ============================================

-- 1. ESTUDANTE (Importado do sistema académico)
CREATE TABLE estudante (
    id SERIAL PRIMARY KEY,
    
    -- Dados de identificação
    numero_estudante VARCHAR(50) UNIQUE NOT NULL, -- Número de matrícula
    numero_bi VARCHAR(30) UNIQUE,
    nome_completo VARCHAR(200) NOT NULL,
    nome_curto VARCHAR(100),
    genero CHAR(1) CHECK (genero IN ('M', 'F')),
    data_nascimento DATE,
    local_nascimento VARCHAR(150),
    provincia_nascimento VARCHAR(100),
    nacionalidade VARCHAR(100) DEFAULT 'Angolana',
    
    -- Dados de contato
    telefone_estudante VARCHAR(20),
    telefone_emergencia VARCHAR(20),
    email_estudante VARCHAR(100),
    email_alternativo VARCHAR(100),
    endereco_actual TEXT,
    municipio_residencia VARCHAR(100),
    provincia_residencia VARCHAR(100),
    
    -- Dados académicos
    curso_id INTEGER NOT NULL REFERENCES curso(id),
    ano_matricula INTEGER NOT NULL,
    regime_ingresso VARCHAR(50) CHECK (regime_ingresso IN ('Concurso Público', 'Transferência', 'Mudança de Curso', 'Outro')),
    numero_inscricao VARCHAR(50), -- Número de inscrição no MESCTI
    
    -- Situação académica
    estado_academico VARCHAR(30) CHECK (estado_academico IN ('Ativo', 'Trancado', 'Desistente', 'Concluído', 'Excluído')),
    ano_academico_atual INTEGER, -- 1º, 2º, 3º, etc.
    media_acumulada DECIMAL(4,2),
    total_creditos_aprovados INTEGER DEFAULT 0,
    
    -- Status financeiro
    situacao_financeira VARCHAR(30) CHECK (situacao_financeira IN ('Regular', 'Inadimplente', 'Isento', 'Bolseiro')),
    
    -- Integração com sistema existente
    data_importacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_sincronizacao TIMESTAMP,
    id_sistema_externo VARCHAR(100), -- ID no sistema académico legado
    hash_dados VARCHAR(64), -- Para controle de alterações
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ck_email_estudante CHECK (email_estudante IS NULL OR email_estudante ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. DOCENTE (Importado do sistema académico)
CREATE TABLE docente (
    id SERIAL PRIMARY KEY,
    
    -- Dados de identificação
    numero_funcionario VARCHAR(50) UNIQUE NOT NULL,
    numero_bi VARCHAR(30) UNIQUE,
    nome_completo VARCHAR(200) NOT NULL,
    nome_curto VARCHAR(100),
    genero CHAR(1) CHECK (genero IN ('M', 'F')),
    data_nascimento DATE,
    nacionalidade VARCHAR(100) DEFAULT 'Angolana',
    
    -- Dados profissionais
    categoria_docente VARCHAR(100) CHECK (categoria_docente IN ('Assistente', 'Auxiliar', 'Associado', 'Catedrático', 'Visiting')),
    regime_trabalho VARCHAR(50) CHECK (regime_trabalho IN ('Tempo Integral', 'Tempo Parcial', 'Horista')),
    area_especializacao VARCHAR(200),
    titulo_academico VARCHAR(100),
    instituicao_titulacao VARCHAR(200),
    ano_titulacao INTEGER,
    
    -- Vinculação institucional
    departamento_id INTEGER REFERENCES departamento(id),
    unidade_organica_id INTEGER REFERENCES unidade_organica(id),
    data_admissao DATE,
    numero_contrato VARCHAR(50),
    
    -- Contato
    telefone_pessoal VARCHAR(20),
    telefone_institucional VARCHAR(20),
    email_pessoal VARCHAR(100),
    email_institucional VARCHAR(100),
    endereco_profissional TEXT,
    
    -- Situação funcional
    estado_funcional VARCHAR(30) CHECK (estado_funcional IN ('Ativo', 'Licença', 'Aposentado', 'Demitido', 'Suspenso')),
    
    -- Integração
    data_importacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_sincronizacao TIMESTAMP,
    id_sistema_externo VARCHAR(100),
    hash_dados VARCHAR(64),
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. HISTÓRICO DE SINCRONIZAÇÃO
CREATE TABLE historico_sincronizacao (
    id SERIAL PRIMARY KEY,
    
    -- Parâmetros da sincronização
    tipo_entidade VARCHAR(50) NOT NULL CHECK (tipo_entidade IN ('Estudante', 'Docente', 'Curso', 'Departamento')),
    origem_sincronizacao VARCHAR(100), -- Sistema académico, RH, etc.
    metodo_sincronizacao VARCHAR(50) CHECK (metodo_sincronizacao IN ('Automático', 'Manual', 'API', 'Ficheiro')),
    
    -- Resultados
    total_registros INTEGER DEFAULT 0,
    novos_registros INTEGER DEFAULT 0,
    atualizados_registros INTEGER DEFAULT 0,
    eliminados_registros INTEGER DEFAULT 0,
    erros INTEGER DEFAULT 0,
    
    -- Detalhes
    ficheiro_origem VARCHAR(255),
    data_inicio_sincronizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fim_sincronizacao TIMESTAMP,
    duracao_segundos INTEGER,
    
    -- Erros e validações
    detalhes_erros JSONB,
    validacoes_realizadas JSONB,
    
    -- Executor
    usuario_id INTEGER REFERENCES usuario(id),
    ip_address INET,
    
    -- Status
    status VARCHAR(20) CHECK (status IN ('Sucesso', 'Falha', 'Parcial', 'Pendente')),
    
    -- Auditoria
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PAUTA (Para geração de documentos académicos)
CREATE TABLE pauta (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_pauta VARCHAR(50) UNIQUE NOT NULL,
    disciplina_nome VARCHAR(200) NOT NULL,
    codigo_disciplina VARCHAR(20),
    
    -- Contexto académico
    curso_id INTEGER NOT NULL REFERENCES curso(id),
    ano_academico_id INTEGER NOT NULL REFERENCES ano_academico(id),
    periodo_letivo_id INTEGER NOT NULL REFERENCES periodo_letivo(id),
    turma VARCHAR(50),
    
    -- Docente responsável
    docente_id INTEGER REFERENCES docente(id),
    
    -- Dados da pauta
    data_avaliacao DATE,
    tipo_avaliacao VARCHAR(50) CHECK (tipo_avaliacao IN ('Normal', 'Recurso', 'Especial', 'Trabalho')),
    total_estudantes INTEGER DEFAULT 0,
    aprovados INTEGER DEFAULT 0,
    reprovados INTEGER DEFAULT 0,
    media_turma DECIMAL(4,2),
    
    -- Status
    estado_pauta VARCHAR(30) CHECK (estado_pauta IN ('Rascunho', 'Submetida', 'Validada', 'Publicada', 'Arquivada')),
    data_validacao DATE,
    validado_por INTEGER REFERENCES docente(id),
    
    -- Integração
    documento_gerado_id INTEGER, -- Referência ao documento gerado
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);