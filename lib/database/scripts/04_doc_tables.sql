-- ============================================
-- TABELAS DE GESTÃO DOCUMENTAL (Módulo Central)
-- RF12 a RF17 - Gestão Documental
-- RF18 a RF22 - Geração Automática
-- RF23 a RF25 - Templates e Modelos
-- ============================================

-- 1. DOCUMENTO (Tabela central)
CREATE TABLE documento (
    id SERIAL PRIMARY KEY,
    
    -- Identificação única
    uuid_documento UUID DEFAULT uuid_generate_v4(),
    numero_documento VARCHAR(100) UNIQUE,
    codigo_referencia VARCHAR(50), -- Código de referência institucional
    
    -- Dados básicos
    titulo VARCHAR(500) NOT NULL,
    descricao TEXT,
    assunto_principal TEXT,
    palavras_chave TEXT[], -- Array de palavras-chave
    
    -- Classificação
    tipo_documento_id INTEGER NOT NULL REFERENCES tipo_documento(id),
    categoria_documental_id INTEGER NOT NULL REFERENCES categoria_documental(id),
    
    -- Contexto institucional
    instituicao_id INTEGER NOT NULL REFERENCES instituicao(id),
    unidade_organica_id INTEGER REFERENCES unidade_organica(id),
    departamento_id INTEGER REFERENCES departamento(id),
    curso_id INTEGER REFERENCES curso(id),
    
    -- Contexto académico
    ano_academico_id INTEGER REFERENCES ano_academico(id),
    periodo_letivo_id INTEGER REFERENCES periodo_letivo(id),
    
    -- Autoria
    usuario_criador_id INTEGER NOT NULL REFERENCES usuario(id),
    autor_nome VARCHAR(200),
    autor_cargo VARCHAR(150),
    
    -- Destinatário
    destinatario_nome VARCHAR(200),
    destinatario_cargo VARCHAR(150),
    destinatario_instituicao VARCHAR(200),
    
    -- Conteúdo do arquivo
    caminho_arquivo VARCHAR(500) NOT NULL,
    nome_arquivo_original VARCHAR(255),
    extensao_arquivo VARCHAR(20),
    tamanho_bytes BIGINT CHECK (tamanho_bytes >= 0),
    hash_arquivo VARCHAR(64), -- SHA256 para integridade
    mime_type VARCHAR(100),
    
    -- Versão
    versao_atual INTEGER DEFAULT 1,
    total_versoes INTEGER DEFAULT 1,
    versao_anterior_id INTEGER REFERENCES documento(id),
    motivo_alteracao TEXT,
    
    -- Datas importantes
    data_documento DATE DEFAULT CURRENT_DATE,
    data_rececao DATE,
    data_assinatura DATE,
    data_validade DATE,
    data_arquivamento DATE,
    
    -- Status do documento
    estado_documento VARCHAR(30) CHECK (estado_documento IN (
        'Rascunho', 'Submetido', 'Em Análise', 'Aprovado', 
        'Rejeitado', 'Assinado', 'Publicado', 'Arquivado', 'Eliminado'
    )),
    confidencial BOOLEAN DEFAULT false,
    acesso_restrito BOOLEAN DEFAULT false,
    arquivado BOOLEAN DEFAULT false,
    
    -- Numeração e autenticação
    sequencial_ano INTEGER, -- Sequencial por tipo e ano
    qr_code_bytea BYTEA,
    codigo_verificacao VARCHAR(50),
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ck_versao CHECK (versao_atual > 0)
);

-- 2. METADADOS DO DOCUMENTO
CREATE TABLE documento_metadata (
    id SERIAL PRIMARY KEY,
    documento_id INTEGER NOT NULL REFERENCES documento(id) ON DELETE CASCADE,
    chave_metadata VARCHAR(100) NOT NULL,
    valor_metadata TEXT,
    tipo_valor VARCHAR(50) CHECK (tipo_valor IN ('Texto', 'Numérico', 'Data', 'Booleano', 'JSON')),
    
    -- Contexto
    categoria_metadata VARCHAR(50),
    obrigatorio BOOLEAN DEFAULT false,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(documento_id, chave_metadata)
);

-- 3. HISTÓRICO DE VERSÕES (RF16)
CREATE TABLE documento_historico (
    id SERIAL PRIMARY KEY,
    documento_id INTEGER NOT NULL REFERENCES documento(id) ON DELETE CASCADE,
    
    -- Versão específica
    versao_numero INTEGER NOT NULL,
    hash_versao VARCHAR(64), -- Hash do conteúdo desta versão
    
    -- Alterações
    acao_realizada VARCHAR(50) NOT NULL CHECK (acao_realizada IN (
        'Criação', 'Alteração', 'Submissão', 'Aprovação', 
        'Rejeição', 'Assinatura', 'Arquivamento', 'Restauração', 'Eliminação'
    )),
    descricao_alteracao TEXT,
    campos_alterados TEXT[], -- Array com nomes dos campos alterados
    
    -- Dados da versão anterior (snapshot)
    dados_anteriores JSONB,
    dados_novos JSONB,
    
    -- Executor
    usuario_id INTEGER NOT NULL REFERENCES usuario(id),
    ip_address INET,
    user_agent TEXT,
    
    -- Datas
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Status
    revertido BOOLEAN DEFAULT false,
    data_reversao TIMESTAMP,
    
    UNIQUE(documento_id, versao_numero)
);

-- 4. TEMPLATE DE DOCUMENTO (RF23, RF24, RF25)
CREATE TABLE template_documento (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_template VARCHAR(50) UNIQUE NOT NULL,
    nome_template VARCHAR(200) NOT NULL,
    descricao_template TEXT,
    
    -- Associação
    tipo_documento_id INTEGER NOT NULL REFERENCES tipo_documento(id),
    categoria_documental_id INTEGER REFERENCES categoria_documental(id),
    
    -- Conteúdo do template
    conteudo_template TEXT NOT NULL, -- Conteúdo em HTML/XML com placeholders
    formato_template VARCHAR(20) CHECK (formato_template IN ('HTML', 'DOCX', 'PDF', 'ODT')),
    caminho_template VARCHAR(500), -- Caminho para arquivo físico
    
    -- Campos dinâmicos
    campos_template JSONB NOT NULL, -- Definição dos campos substituíveis
    exemplo_valores JSONB, -- Valores de exemplo para preview
    
    -- Configurações
    exige_assinatura BOOLEAN DEFAULT true,
    exige_aprovacao BOOLEAN DEFAULT false,
    numeracao_automatica BOOLEAN DEFAULT true,
    modelo_oficial BOOLEAN DEFAULT true,
    
    -- Versão
    versao_template VARCHAR(20) DEFAULT '1.0',
    template_anterior_id INTEGER REFERENCES template_documento(id),
    data_publicacao DATE DEFAULT CURRENT_DATE,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_validade DATE,
    
    -- Autor
    autor_template_id INTEGER REFERENCES usuario(id),
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCUMENTO GERADO (RF18, RF19, RF20, RF21)
CREATE TABLE documento_gerado (
    id SERIAL PRIMARY KEY,
    
    -- Relacionamentos
    documento_id INTEGER NOT NULL REFERENCES documento(id),
    template_id INTEGER NOT NULL REFERENCES template_documento(id),
    usuario_gerador_id INTEGER NOT NULL REFERENCES usuario(id),
    
    -- Dados da geração
    dados_preenchimento JSONB NOT NULL, -- Valores usados para preencher o template
    parametros_geracao JSONB, -- Parâmetros específicos da geração
    
    -- Informações de saída
    formato_gerado VARCHAR(20) CHECK (formato_gerado IN ('PDF', 'DOCX', 'ODT', 'HTML')),
    caminho_arquivo_gerado VARCHAR(500),
    hash_arquivo_gerado VARCHAR(64),
    
    -- Autenticação
    numero_autenticacao VARCHAR(100) UNIQUE,
    codigo_verificacao VARCHAR(50),
    qr_code_bytea BYTEA,
    data_autenticacao TIMESTAMP,
    
    -- Status
    geracao_sucesso BOOLEAN DEFAULT true,
    mensagem_erro TEXT,
    
    -- Auditoria
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP,
    
    UNIQUE(documento_id, template_id)
);

-- 6. FLUXO DE APROVAÇÃO (Base legal hierárquica)
CREATE TABLE fluxo_aprovacao (
    id SERIAL PRIMARY KEY,
    documento_id INTEGER NOT NULL REFERENCES documento(id) ON DELETE CASCADE,
    
    -- Configuração do fluxo
    tipo_fluxo VARCHAR(50) CHECK (tipo_fluxo IN ('Linear', 'Paralelo', 'Hierárquico')),
    etapas_total INTEGER DEFAULT 1,
    etapa_atual INTEGER DEFAULT 1,
    
    -- Status do fluxo
    estado_fluxo VARCHAR(30) CHECK (estado_fluxo IN (
        'Pendente', 'Em Andamento', 'Aprovado', 'Rejeitado', 'Cancelado'
    )),
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ETAPA DE APROVAÇÃO
CREATE TABLE etapa_aprovacao (
    id SERIAL PRIMARY KEY,
    fluxo_id INTEGER NOT NULL REFERENCES fluxo_aprovacao(id) ON DELETE CASCADE,
    
    -- Configuração da etapa
    ordem_etapa INTEGER NOT NULL,
    perfil_aprovador_id INTEGER NOT NULL REFERENCES perfil_usuario(id),
    
    -- Aprovador específico (se aplicável)
    usuario_aprovador_id INTEGER REFERENCES usuario(id),
    
    -- Status da etapa
    estado_etapa VARCHAR(30) CHECK (estado_etapa IN (
        'Pendente', 'Aprovado', 'Rejeitado', 'Pulada', 'Cancelada'
    )),
    data_limite DATE,
    
    -- Decisão
    data_decisao TIMESTAMP,
    decisao_comentarios TEXT,
    
    -- Ação realizada
    acao_realizada VARCHAR(50), -- Assinatura, visto, aprovação, etc.
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ASSINATURA DIGITAL (Conforme legislação)
CREATE TABLE assinatura_documento (
    id SERIAL PRIMARY KEY,
    documento_id INTEGER NOT NULL REFERENCES documento(id) ON DELETE CASCADE,
    
    -- Assinante
    usuario_assinante_id INTEGER NOT NULL REFERENCES usuario(id),
    cargo_assinante VARCHAR(150),
    
    -- Assinatura
    tipo_assinatura VARCHAR(50) CHECK (tipo_assinatura IN ('Digital', 'Eletrônica', 'Manual', 'Carimbo')),
    hash_assinatura VARCHAR(64),
    certificado_digital TEXT,
    
    -- Contexto
    motivo_assinatura TEXT,
    local_assinatura VARCHAR(200),
    
    -- Datas
    data_assinatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_validade_assinatura DATE,
    
    -- Status
    valida BOOLEAN DEFAULT true,
    motivo_invalidacao TEXT,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);