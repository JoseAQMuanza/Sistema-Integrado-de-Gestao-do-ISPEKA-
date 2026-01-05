-- ============================================
-- TABELAS DA SEÇÃO DE QUALIDADE
-- RF26 a RF29 - Secção de Qualidade
-- ============================================

-- 1. AUDITORIA INTERNA (RF26)
CREATE TABLE auditoria_interna (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_auditoria VARCHAR(50) UNIQUE NOT NULL,
    titulo_auditoria VARCHAR(300) NOT NULL,
    tipo_auditoria VARCHAR(50) CHECK (tipo_auditoria IN ('Interna', 'Externa', 'Mista', 'Especial')),
    
    -- Planeamento
    objetivo_auditoria TEXT NOT NULL,
    escopo_auditoria TEXT,
    criterios_auditoria TEXT,
    referencia_normativa TEXT, -- ISO, normas internas, etc.
    
    -- Programação
    data_inicio_planeada DATE NOT NULL,
    data_fim_planeada DATE NOT NULL,
    data_inicio_real DATE,
    data_fim_real DATE,
    
    -- Equipa auditora
    auditor_lider_id INTEGER REFERENCES usuario(id),
    auditores_ids INTEGER[],
    
    -- Área auditada
    unidade_organica_id INTEGER REFERENCES unidade_organica(id),
    departamento_id INTEGER REFERENCES departamento(id),
    processo_auditado VARCHAR(200),
    
    -- Status
    estado_auditoria VARCHAR(30) CHECK (estado_auditoria IN (
        'Planeada', 'Em Execução', 'Concluída', 'Cancelada', 'Suspensa'
    )),
    
    -- Relatório
    documento_relatorio_id INTEGER REFERENCES documento(id),
    data_aprovacao_relatorio DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. EVIDÊNCIA DE AUDITORIA (RF27)
CREATE TABLE evidencia_auditoria (
    id SERIAL PRIMARY KEY,
    auditoria_id INTEGER NOT NULL REFERENCES auditoria_interna(id) ON DELETE CASCADE,
    
    -- Identificação
    codigo_evidencia VARCHAR(50),
    descricao_evidencia TEXT NOT NULL,
    tipo_evidencia VARCHAR(50) CHECK (tipo_evidencia IN (
        'Documental', 'Registro', 'Observação', 'Entrevista', 'Fotografia', 'Vídeo'
    )),
    
    -- Classificação
    categoria_evidencia VARCHAR(50) CHECK (categoria_evidencia IN (
        'Conformidade', 'Não Conformidade', 'Oportunidade de Melhoria', 'Boa Prática'
    )),
    criticidade VARCHAR(20) CHECK (criticidade IN ('Baixa', 'Média', 'Alta', 'Crítica')),
    
    -- Documento associado
    documento_id INTEGER REFERENCES documento(id),
    referencia_documento VARCHAR(200),
    
    -- Coleta
    data_coleta DATE DEFAULT CURRENT_DATE,
    coletada_por INTEGER REFERENCES usuario(id),
    metodo_coleta VARCHAR(100),
    
    -- Status
    validada BOOLEAN DEFAULT false,
    data_validacao DATE,
    validada_por INTEGER REFERENCES usuario(id),
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. NÃO CONFORMIDADE (RF29)
CREATE TABLE nao_conformidade (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_nc VARCHAR(50) UNIQUE NOT NULL,
    descricao_nc TEXT NOT NULL,
    tipo_nc VARCHAR(50) CHECK (tipo_nc IN ('Maior', 'Menor', 'Observação', 'Crítica')),
    
    -- Origem
    fonte_deteccao VARCHAR(100) CHECK (fonte_deteccao IN (
        'Auditoria', 'Reclamação', 'Monitorização', 'Autoavaliação', 'Outro'
    )),
    auditoria_id INTEGER REFERENCES auditoria_interna(id),
    
    -- Deteção
    data_deteccao DATE NOT NULL,
    detectada_por INTEGER REFERENCES usuario(id),
    processo_afetado VARCHAR(200),
    requisito_nao_atendido TEXT,
    
    -- Análise
    causa_raiz TEXT,
    analisada_por INTEGER REFERENCES usuario(id),
    data_analise DATE,
    
    -- Tratamento
    acao_imediata TEXT,
    responsavel_acao_imediata INTEGER REFERENCES usuario(id),
    prazo_acao_imediata DATE,
    
    -- Status
    estado_nc VARCHAR(30) CHECK (estado_nc IN (
        'Registrada', 'Em Análise', 'Em Tratamento', 'Verificada', 'Encerrada', 'Reaberta'
    )),
    data_encerramento DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PLANO DE MELHORIA (RF29)
CREATE TABLE plano_melhoria (
    id SERIAL PRIMARY KEY,
    nao_conformidade_id INTEGER NOT NULL REFERENCES nao_conformidade(id) ON DELETE CASCADE,
    
    -- Identificação
    codigo_plano VARCHAR(50),
    descricao_acao TEXT NOT NULL,
    tipo_acao VARCHAR(50) CHECK (tipo_acao IN ('Corretiva', 'Preventiva', 'Melhoria')),
    
    -- Implementação
    responsavel_implementacao INTEGER NOT NULL REFERENCES usuario(id),
    data_inicio_planeada DATE NOT NULL,
    data_fim_planeada DATE NOT NULL,
    data_inicio_real DATE,
    data_fim_real DATE,
    
    -- Recursos
    recursos_necessarios TEXT,
    custo_estimado DECIMAL(10,2),
    
    -- Indicadores
    indicador_sucesso TEXT,
    metodo_verificacao TEXT,
    
    -- Status
    estado_plano VARCHAR(30) CHECK (estado_plano IN (
        'Planejado', 'Em Execução', 'Concluído', 'Atrasado', 'Cancelado'
    )),
    eficaz BOOLEAN DEFAULT false,
    data_verificacao_eficacia DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INTEGER,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. INDICADOR DE QUALIDADE
CREATE TABLE indicador_qualidade (
    id SERIAL PRIMARY KEY,
    
    -- Identificação
    codigo_indicador VARCHAR(50) UNIQUE NOT NULL,
    nome_indicador VARCHAR(200) NOT NULL,
    descricao_indicador TEXT,
    
    -- Classificação
    categoria_indicador VARCHAR(50) CHECK (categoria_indicador IN (
        'Eficácia', 'Eficiência', 'Satisfação', 'Conformidade', 'Desempenho'
    )),
    processo_associado VARCHAR(200),
    
    -- Metodologia
    formula_calculo TEXT,
    unidade_medida VARCHAR(50),
    fonte_dados VARCHAR(200),
    frequencia_medicao VARCHAR(50) CHECK (frequencia_medicao IN (
        'Diária', 'Semanal', 'Mensal', 'Trimestral', 'Semestral', 'Anual'
    )),
    
    -- Metas
    meta_minima DECIMAL(10,2),
    meta_esperada DECIMAL(10,2),
    meta_otima DECIMAL(10,2),
    tolerancia DECIMAL(5,2),
    
    -- Responsabilidade
    responsavel_coleta INTEGER REFERENCES usuario(id),
    responsavel_analise INTEGER REFERENCES usuario(id),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_ativacao DATE DEFAULT CURRENT_DATE,
    data_desativacao DATE,
    
    -- Auditoria
    criado_por INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. REGISTRO DE INDICADOR
CREATE TABLE registro_indicador (
    id SERIAL PRIMARY KEY,
    indicador_id INTEGER NOT NULL REFERENCES indicador_qualidade(id) ON DELETE CASCADE,
    
    -- Período de referência
    ano_referencia INTEGER NOT NULL,
    periodo_referencia VARCHAR(50), -- Mês, trimestre, semestre
    data_referencia DATE NOT NULL,
    
    -- Valor medido
    valor_medido DECIMAL(10,2) NOT NULL,
    observacoes_medicao TEXT,
    
    -- Análise
    tendencia VARCHAR(20) CHECK (tendencia IN ('Ascendente', 'Descendente', 'Estável', 'Variável')),
    atingiu_meta BOOLEAN,
    analise_resultado TEXT,
    
    -- Ações derivadas
    acoes_recomendadas TEXT,
    
    -- Coleta
    coletado_por INTEGER REFERENCES usuario(id),
    data_coleta DATE DEFAULT CURRENT_DATE,
    
    -- Status
    validado BOOLEAN DEFAULT false,
    validado_por INTEGER REFERENCES usuario(id),
    data_validacao DATE,
    
    -- Auditoria
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);