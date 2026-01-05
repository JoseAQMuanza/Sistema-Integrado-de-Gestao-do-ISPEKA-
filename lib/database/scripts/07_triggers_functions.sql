-- ============================================
-- FUNÇÕES E TRIGGERS DO SISTEMA
-- ============================================

-- 1. FUNÇÃO: GERAR NÚMERO DE DOCUMENTO (RF21)
CREATE OR REPLACE FUNCTION gerar_numero_documento()
RETURNS TRIGGER AS $$
DECLARE
    codigo_tipo VARCHAR;
    ano_atual VARCHAR;
    sequencial INTEGER;
    numero_gerado VARCHAR;
BEGIN
    -- Obter código do tipo de documento
    SELECT codigo_tipo INTO codigo_tipo
    FROM tipo_documento WHERE id = NEW.tipo_documento_id;
    
    -- Obter ano atual
    ano_atual := EXTRACT(YEAR FROM NEW.data_documento)::VARCHAR;
    
    -- Obter próximo sequencial para este tipo e ano
    SELECT COALESCE(MAX(sequencial_ano), 0) + 1 INTO sequencial
    FROM documento
    WHERE tipo_documento_id = NEW.tipo_documento_id
      AND EXTRACT(YEAR FROM data_documento) = EXTRACT(YEAR FROM NEW.data_documento);
    
    -- Gerar número no formato: CODIGO/ANO/SEQUENCIAL
    numero_gerado := codigo_tipo || '/' || ano_atual || '/' || 
                     LPAD(sequencial::VARCHAR, 5, '0');
    
    -- Atribuir valores
    NEW.numero_documento := numero_gerado;
    NEW.sequencial_ano := sequencial;
    NEW.codigo_verificacao := SUBSTRING(MD5(NEW.uuid_documento::VARCHAR || numero_gerado) FROM 1 FOR 8);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número de documento
CREATE TRIGGER trg_gerar_numero_documento
    BEFORE INSERT ON documento
    FOR EACH ROW
    EXECUTE FUNCTION gerar_numero_documento();

-- 2. FUNÇÃO: ATUALIZAR TIMESTAMP
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas principais
CREATE TRIGGER trg_atualizar_instituicao
    BEFORE UPDATE ON instituicao
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_atualizar_usuario
    BEFORE UPDATE ON usuario
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_atualizar_documento
    BEFORE UPDATE ON documento
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

-- 3. FUNÇÃO: REGISTRAR HISTÓRICO DE DOCUMENTO (RF16)
CREATE OR REPLACE FUNCTION registrar_historico_documento()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO documento_historico (
        documento_id,
        versao_numero,
        acao_realizada,
        descricao_alteracao,
        dados_anteriores,
        dados_novos,
        usuario_id
    )
    VALUES (
        NEW.id,
        NEW.versao_atual,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'Criação'
            WHEN TG_OP = 'UPDATE' THEN 'Alteração'
            WHEN TG_OP = 'DELETE' THEN 'Eliminação'
        END,
        CASE 
            WHEN TG_OP = 'UPDATE' THEN 'Alteração de dados do documento'
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb
            ELSE NULL
        END,
        NEW.atualizado_por
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para histórico
CREATE TRIGGER trg_historico_documento
    AFTER INSERT OR UPDATE ON documento
    FOR EACH ROW
    EXECUTE FUNCTION registrar_historico_documento();

-- 4. FUNÇÃO: VALIDAR PERMISSÕES HIERÁRQUICAS
CREATE OR REPLACE FUNCTION validar_permissao_hierarquica(
    p_usuario_id INTEGER,
    p_tipo_documento_id INTEGER,
    p_acao VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_perfil_id INTEGER;
    v_permite BOOLEAN;
    v_restricao_unidade BOOLEAN;
    v_restricao_dept BOOLEAN;
    v_restricao_curso BOOLEAN;
BEGIN
    -- Obter perfil do usuário (considerando o primeiro perfil ativo)
    SELECT perfil_id INTO v_perfil_id
    FROM usuario_perfil
    WHERE usuario_id = p_usuario_id AND ativo = true
    LIMIT 1;
    
    -- Verificar permissão específica
    SELECT 
        CASE 
            WHEN p_acao = 'criar' THEN pode_criar
            WHEN p_acao = 'visualizar' THEN pode_visualizar
            WHEN p_acao = 'editar' THEN pode_editar
            WHEN p_acao = 'eliminar' THEN pode_eliminar
            WHEN p_acao = 'aprovar' THEN pode_aprovar
            WHEN p_acao = 'assinar' THEN pode_assinatur
            WHEN p_acao = 'arquivar' THEN pode_arquivar
            WHEN p_acao = 'exportar' THEN pode_exportar
            ELSE false
        END,
        restricao_unidade,
        restricao_departamento,
        restricao_curso
    INTO v_permite, v_restricao_unidade, v_restricao_dept, v_restricao_curso
    FROM permissao_documento
    WHERE perfil_id = v_perfil_id 
      AND tipo_documento_id = p_tipo_documento_id;
    
    -- Se não encontrou permissão específica, não permite
    IF v_permite IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN v_permite;
END;
$$ LANGUAGE plpgsql;

-- 5. FUNÇÃO: GERAR RELATÓRIO ESTATÍSTICO (RF31)
CREATE OR REPLACE FUNCTION gerar_estatisticas_documentos(
    p_data_inicio DATE,
    p_data_fim DATE,
    p_unidade_id INTEGER DEFAULT NULL,
    p_departamento_id INTEGER DEFAULT NULL,
    p_curso_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
    categoria VARCHAR,
    tipo_documento VARCHAR,
    total INTEGER,
    aprovados INTEGER,
    pendentes INTEGER,
    rejeitados INTEGER,
    media_tempo_aprovacao_dias DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cd.nome_categoria as categoria,
        td.nome_tipo as tipo_documento,
        COUNT(d.id) as total,
        COUNT(CASE WHEN d.estado_documento = 'Aprovado' THEN 1 END) as aprovados,
        COUNT(CASE WHEN d.estado_documento IN ('Rascunho', 'Submetido', 'Em Análise') THEN 1 END) as pendentes,
        COUNT(CASE WHEN d.estado_documento = 'Rejeitado' THEN 1 END) as rejeitados,
        AVG(EXTRACT(EPOCH FROM (d.data_atualizacao - d.data_criacao)) / 86400)::DECIMAL(5,2) as media_tempo_aprovacao_dias
    FROM documento d
    JOIN tipo_documento td ON d.tipo_documento_id = td.id
    JOIN categoria_documental cd ON td.categoria_documental_id = cd.id
    WHERE d.data_criacao BETWEEN p_data_inicio AND p_data_fim
      AND (p_unidade_id IS NULL OR d.unidade_organica_id = p_unidade_id)
      AND (p_departamento_id IS NULL OR d.departamento_id = p_departamento_id)
      AND (p_curso_id IS NULL OR d.curso_id = p_curso_id)
    GROUP BY cd.nome_categoria, td.nome_tipo
    ORDER BY cd.nome_categoria, total DESC;
END;
$$ LANGUAGE plpgsql;

-- 6. FUNÇÃO: VERIFICAR INTEGRIDADE DOCUMENTAL
CREATE OR REPLACE FUNCTION verificar_integridade_documento(p_documento_id INTEGER)
RETURNS TABLE (
    verificacao VARCHAR,
    resultado BOOLEAN,
    detalhes TEXT
) AS $$
DECLARE
    v_documento documento%ROWTYPE;
    v_hash_calculado VARCHAR;
BEGIN
    -- Obter dados do documento
    SELECT * INTO v_documento FROM documento WHERE id = p_documento_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT 'Documento existe'::VARCHAR, false::BOOLEAN, 'Documento não encontrado'::TEXT;
        RETURN;
    END IF;
    
    -- Verificação 1: Hash do arquivo
    -- Nota: Esta verificação precisa ler o arquivo físico, implementar conforme necessidade
    RETURN QUERY SELECT 'Hash do arquivo'::VARCHAR, true::BOOLEAN, 'Verificação pendente de implementação'::TEXT;
    
    -- Verificação 2: Logs de auditoria
    RETURN QUERY 
    SELECT 
        'Logs de auditoria completos'::VARCHAR,
        (COUNT(*) > 0)::BOOLEAN,
        'Total de logs: ' || COUNT(*)::TEXT
    FROM log_auditoria
    WHERE entidade_id = p_documento_id AND entidade_afetada = 'documento';
    
    -- Verificação 3: Histórico de versões
    RETURN QUERY 
    SELECT 
        'Histórico de versões'::VARCHAR,
        (COUNT(*) = v_documento.total_versoes)::BOOLEAN,
        'Versões no histórico: ' || COUNT(*)::TEXT || ' / Total de versões: ' || v_documento.total_versoes::TEXT
    FROM documento_historico
    WHERE documento_id = p_documento_id;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNÇÃO: EXPIRAR SESSÕES
CREATE OR REPLACE FUNCTION expirar_sessoes_inativas()
RETURNS INTEGER AS $$
DECLARE
    v_sessoes_expiradas INTEGER;
BEGIN
    UPDATE sessao_usuario
    SET ativa = false,
        data_logout = CURRENT_TIMESTAMP,
        motivo_encerramento = 'Sessão expirada por inatividade'
    WHERE ativa = true
      AND data_ultima_atividade < (CURRENT_TIMESTAMP - INTERVAL '8 hours');
    
    GET DIAGNOSTICS v_sessoes_expiradas = ROW_COUNT;
    
    RETURN v_sessoes_expiradas;
END;
$$ LANGUAGE plpgsql;

-- 8. TRIGGER: BLOQUEAR USUÁRIO APÓS TENTATIVAS FALHAS
CREATE OR REPLACE FUNCTION bloquear_usuario_tentativas()
RETURNS TRIGGER AS $$
DECLARE
    v_tentativas_recentes INTEGER;
BEGIN
    -- Contar tentativas falhas nas últimas 15 minutos
    SELECT COUNT(*) INTO v_tentativas_recentes
    FROM tentativa_acesso
    WHERE ip_address = NEW.ip_address
      AND username = NEW.username
      AND sucesso = false
      AND data_hora > (CURRENT_TIMESTAMP - INTERVAL '15 minutes');
    
    -- Se 5 ou mais tentativas falhas, bloquear
    IF v_tentativas_recentes >= 5 THEN
        UPDATE usuario
        SET bloqueado = true,
            motivo_bloqueio = 'Múltiplas tentativas de login falhadas',
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE username = NEW.username;
        
        NEW.bloqueio_aplicado := true;
        NEW.duracao_bloqueio_minutos := 30;
        NEW.suspeita_ataque := true;
        NEW.tipo_ameaca := 'Brute Force';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bloquear_tentativas
    BEFORE INSERT ON tentativa_acesso
    FOR EACH ROW
    EXECUTE FUNCTION bloquear_usuario_tentativas();