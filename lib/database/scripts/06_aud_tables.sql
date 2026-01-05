-- ============================================
-- TABELAS DE AUDITORIA E RELATÓRIOS
-- RF30 a RF32 - Relatórios e Estatísticas
-- RF33 a RF35 - Segurança e Auditoria
-- ============================================

-- 1. LOG DE AUDITORIA DO SISTEMA (RF33)
CREATE TABLE log_auditoria (
    id SERIAL PRIMARY KEY,
    
    -- Identificação da ação
    uuid_log UUID DEFAULT uuid_generate_v4(),
    tipo_acao VARCHAR(50) NOT NULL CHECK (tipo_acao IN (
        'Login', 'Logout', 'Criação', 'Leitura', 'Atualização', 'Eliminação',
        'Download', 'Upload', 'Aprovação', 'Rejeição', 'Assinatura', 'Exportação',
        'Importação', 'Sincronização', 'Backup', 'Restauração'
    )),
    
    -- Contexto
    modulo_sistema VARCHAR(100),
    entidade_afetada VARCHAR(100),
    entidade_id INTEGER,
    nome_registro VARCHAR(500),
    
    -- Usuário e sessão
    usuario_id INTEGER REFERENCES usuario(id),
    username VARCHAR(50),
    perfil_usuario VARCHAR(100),
    
    -- Dados técnicos
    ip_address INET,
    user_agent TEXT,
    dispositivo VARCHAR(200),
    navegador VARCHAR(100),
    sistema_operacional VARCHAR(100),
    
    -- Localização (se disponível)
    pais VARCHAR(100),
    cidade VARCHAR(100),
    coordenadas GEOGRAPHY(POINT, 4326),
    
    -- Dados da ação
    dados_anteriores JSONB,
    dados_novos JSONB,
    detalhes_acao TEXT,
    
    -- Status
    sucesso BOOLEAN DEFAULT true,
    codigo_erro VARCHAR(50),
    mensagem_erro TEXT,
    
    -- Performance
    duracao_ms INTEGER,
    
    -- Timestamps
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índice para consultas rápidas
    INDEX idx_log_timestamp (data_hora DESC),
    INDEX idx_log_usuario (usuario_id, data_hora DESC),
    INDEX idx_log_acao (tipo_acao, data_hora DESC)
);

COMMENT ON TABLE log_auditoria IS 'Registro completo de todas as ações no sistema para auditoria e conformidade legal';

-- 2. RELATÓRIO CONFIGURÁVEL (RF30)
CREATE TABLE relatorio_config (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_relatorio VARCHAR(50) UNIQUE NOT NULL,
    nome_relatorio VARCHAR(200) NOT NULL,
    descricao_relatorio TEXT,
    
    -- Classificação
    categoria_relatorio VARCHAR(50) CHECK (categoria_relatorio IN (
        'Académico', 'Administrativo', 'Qualidade', 'Institucional', 'Estatístico', 'Financeiro'
    )),
    publico_alvo VARCHAR(200), -- Perfis que podem acessar
    
    -- Configuração técnica
    tipo_relatorio VARCHAR(50) CHECK (tipo_relatorio IN ('Dinâmico', 'Estático', 'Agendado')),
    query_base TEXT, -- Query SQL ou procedimento armazenado
    parametros_config JSONB, -- Parâmetros configuráveis
    
    -- Formato e entrega
    formatos_suportados VARCHAR(100) DEFAULT 'PDF,Excel',
    template_relatorio VARCHAR(500), -- Caminho para template
    agendamento_cron VARCHAR(100), -- Expressão cron para agendamento
    
    -- Destinatários
    destinatarios_automaticos INTEGER[], -- IDs de usuários
    enviar_email BOOLEAN DEFAULT false,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_ativacao DATE DEFAULT CURRENT_DATE,
    data_desativacao DATE,
    
    -- Permissões
    perfil_acesso INTEGER[],
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. RELATÓRIO GERADO (RF32)
CREATE TABLE relatorio_gerado (
    id SERIAL PRIMARY KEY,
    
    -- Relacionamentos
    relatorio_config_id INTEGER NOT NULL REFERENCES relatorio_config(id),
    documento_id INTEGER REFERENCES documento(id),
    
    -- Parâmetros usados
    parametros_uso JSONB NOT NULL,
    filtros_aplicados JSONB,
    
    -- Resultados
    total_registros INTEGER DEFAULT 0,
    periodo_inicio DATE,
    periodo_fim DATE,
    
    -- Geração
    usuario_gerador_id INTEGER NOT NULL REFERENCES usuario(id),
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracao_geracao_ms INTEGER,
    
    -- Arquivo gerado
    formato_gerado VARCHAR(20) CHECK (formato_gerado IN ('PDF', 'Excel', 'CSV', 'HTML', 'Word')),
    caminho_arquivo VARCHAR(500),
    tamanho_bytes BIGINT,
    hash_arquivo VARCHAR(64),
    
    -- Distribuição
    enviado_email BOOLEAN DEFAULT false,
    destinatarios_email TEXT[],
    data_envio_email TIMESTAMP,
    
    -- Status
    geracao_sucesso BOOLEAN DEFAULT true,
    mensagem_erro TEXT,
    
    -- Auditoria
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BACKUP REGISTRO (RF35)
CREATE TABLE backup_registro (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_backup VARCHAR(50) UNIQUE NOT NULL,
    tipo_backup VARCHAR(50) NOT NULL CHECK (tipo_backup IN (
        'Completo', 'Incremental', 'Diferencial', 'Documentos', 'Banco_Dados', 'Logs'
    )),
    
    -- Configuração
    escopo_backup VARCHAR(200), -- O que foi incluído
    metodo_backup VARCHAR(100), -- Ferramenta/método usado
    nivel_compressao INTEGER CHECK (nivel_compressao BETWEEN 0 AND 9),
    
    -- Arquivo
    caminho_backup VARCHAR(500) NOT NULL,
    nome_arquivo VARCHAR(255),
    tamanho_bytes BIGINT CHECK (tamanho_bytes >= 0),
    
    -- Validação
    checksum_md5 VARCHAR(32),
    checksum_sha256 VARCHAR(64),
    verificado BOOLEAN DEFAULT false,
    data_verificacao TIMESTAMP,
    
    -- Execução
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP,
    duracao_segundos INTEGER,
    
    -- Executor
    usuario_executor INTEGER REFERENCES usuario(id),
    sistema_origem VARCHAR(100),
    
    -- Status
    status_backup VARCHAR(20) CHECK (status_backup IN (
        'Sucesso', 'Falha', 'Parcial', 'Em_Andamento', 'Cancelado'
    )),
    mensagem_status TEXT,
    
    -- Retenção
    data_expiracao TIMESTAMP,
    ciclos_retidos INTEGER DEFAULT 1,
    
    -- Recuperação
    utilizado_para_restauracao BOOLEAN DEFAULT false,
    data_restauracao TIMESTAMP,
    
    -- Auditoria
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ck_datas CHECK (data_fim > data_inicio OR data_fim IS NULL)
);

-- 5. SESSÃO DE USUÁRIO
CREATE TABLE sessao_usuario (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    session_id VARCHAR(255) UNIQUE NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id),
    
    -- Autenticação
    token_acesso VARCHAR(512),
    token_atualizacao VARCHAR(512),
    metodo_autenticacao VARCHAR(50) CHECK (metodo_autenticacao IN (
        'Local', 'LDAP', 'OAuth', 'SAML', 'Certificado'
    )),
    
    -- Datas da sessão
    data_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_ultima_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_logout TIMESTAMP,
    data_expiracao TIMESTAMP,
    
    -- Dados técnicos
    ip_address INET,
    user_agent TEXT,
    dispositivo VARCHAR(200),
    localizacao VARCHAR(200),
    
    -- Status
    ativa BOOLEAN DEFAULT true,
    motivo_encerramento VARCHAR(200),
    
    -- Segurança
    mfa_utilizado BOOLEAN DEFAULT false,
    nivel_autenticacao INTEGER DEFAULT 1,
    
    -- Auditoria
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TENTATIVA DE ACESSO
CREATE TABLE tentativa_acesso (
    id SERIAL PRIMARY KEY,
    
    -- Dados da tentativa
    username VARCHAR(50),
    ip_address INET NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contexto
    user_agent TEXT,
    url_tentativa VARCHAR(500),
    metodo_http VARCHAR(10),
    
    -- Resultado
    sucesso BOOLEAN DEFAULT false,
    motivo_falha VARCHAR(200),
    codigo_resposta INTEGER,
    
    -- Medidas de segurança
    bloqueio_aplicado BOOLEAN DEFAULT false,
    duracao_bloqueio_minutos INTEGER,
    
    -- Detecção de ameaças
    suspeita_ataque BOOLEAN DEFAULT false,
    tipo_ameaca VARCHAR(50),
    
    -- Indexação
    INDEX idx_tentativas_ip (ip_address, data_hora DESC),
    INDEX idx_tentativas_usuario (username, data_hora DESC)
);