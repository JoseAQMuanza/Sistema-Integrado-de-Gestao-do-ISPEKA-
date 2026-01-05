-- ============================================
-- ÍNDICES PARA PERFORMANCE (RNF03)
-- ============================================

-- 1. ÍNDICES PARA TABELA DOCUMENTO (Mais acessada)
CREATE INDEX idx_documento_tipo ON documento(tipo_documento_id);
CREATE INDEX idx_documento_estado ON documento(estado_documento);
CREATE INDEX idx_documento_data ON documento(data_documento DESC);
CREATE INDEX idx_documento_criacao ON documento(data_criacao DESC);
CREATE INDEX idx_documento_usuario ON documento(usuario_criador_id);
CREATE INDEX idx_documento_unidade ON documento(unidade_organica_id);
CREATE INDEX idx_documento_departamento ON documento(departamento_id);
CREATE INDEX idx_documento_curso ON documento(curso_id);
CREATE INDEX idx_documento_ano_academico ON documento(ano_academico_id);
CREATE INDEX idx_documento_uuid ON documento(uuid_documento);
CREATE INDEX idx_documento_numero ON documento(numero_documento);

-- Índice parcial para documentos ativos
CREATE INDEX idx_documento_ativos 
ON documento(id) 
WHERE arquivado = false AND estado_documento NOT IN ('Eliminado', 'Arquivado');

-- Índice para busca full-text
CREATE INDEX idx_documento_busca 
ON documento USING GIN(to_tsvector('portuguese', titulo || ' ' || COALESCE(descricao, '') || ' ' || COALESCE(assunto_principal, '')));

-- Índice para similaridade
CREATE INDEX idx_documento_similaridade 
ON documento USING GIN (titulo gin_trgm_ops);

-- 2. ÍNDICES PARA TABELA USUÁRIO
CREATE INDEX idx_usuario_username ON usuario(username);
CREATE INDEX idx_usuario_email ON usuario(email_institucional);
CREATE INDEX idx_usuario_identificacao ON usuario(numero_identificacao);
CREATE INDEX idx_usuario_ativo ON usuario(ativo) WHERE ativo = true;
CREATE INDEX idx_usuario_bloqueado ON usuario(bloqueado) WHERE bloqueado = true;

-- 3. ÍNDICES PARA TABELA ESTUDANTE
CREATE INDEX idx_estudante_numero ON estudante(numero_estudante);
CREATE INDEX idx_estudante_bi ON estudante(numero_bi);
CREATE INDEX idx_estudante_curso ON estudante(curso_id);
CREATE INDEX idx_estudante_estado ON estudante(estado_academico);
CREATE INDEX idx_estudante_nome ON estudante USING GIN(to_tsvector('portuguese', nome_completo));

-- 4. ÍNDICES PARA TABELA DOCENTE
CREATE INDEX idx_docente_numero ON docente(numero_funcionario);
CREATE INDEX idx_docente_departamento ON docente(departamento_id);
CREATE INDEX idx_docente_estado ON docente(estado_funcional);

-- 5. ÍNDICES PARA LOG DE AUDITORIA
CREATE INDEX idx_log_data ON log_auditoria(data_hora DESC);
CREATE INDEX idx_log_usuario ON log_auditoria(usuario_id, data_hora DESC);
CREATE INDEX idx_log_acao ON log_auditoria(tipo_acao, data_hora DESC);
CREATE INDEX idx_log_ip ON log_auditoria(ip_address, data_hora DESC);
CREATE INDEX idx_log_entidade ON log_auditoria(entidade_afetada, entidade_id);

-- 6. ÍNDICES PARA PERMISSÕES
CREATE INDEX idx_permissao_perfil ON permissao_documento(perfil_id);
CREATE INDEX idx_permissao_tipo ON permissao_documento(tipo_documento_id);
CREATE INDEX idx_permissao_completa ON permissao_documento(perfil_id, tipo_documento_id);

-- 7. ÍNDICES PARA RELATÓRIOS
CREATE INDEX idx_relatorio_config_categoria ON relatorio_config(categoria_relatorio);
CREATE INDEX idx_relatorio_gerado_data ON relatorio_gerado(data_geracao DESC);
CREATE INDEX idx_relatorio_gerado_usuario ON relatorio_gerado(usuario_gerador_id, data_geracao DESC);

-- 8. ÍNDICES PARA QUALIDADE
CREATE INDEX idx_auditoria_estado ON auditoria_interna(estado_auditoria);
CREATE INDEX idx_auditoria_data ON auditoria_interna(data_inicio_planeada);
CREATE INDEX idx_nc_estado ON nao_conformidade(estado_nc);
CREATE INDEX idx_nc_data ON nao_conformidade(data_deteccao DESC);

-- 9. ÍNDICES PARA SESSÕES
CREATE INDEX idx_sessao_usuario ON sessao_usuario(usuario_id, data_login DESC);
CREATE INDEX idx_sessao_ativa ON sessao_usuario(ativa) WHERE ativa = true;
CREATE INDEX idx_sessao_token ON sessao_usuario(token_acesso);

-- 10. ÍNDICES PARA TENTATIVAS DE ACESSO
CREATE INDEX idx_tentativa_ip ON tentativa_acesso(ip_address, data_hora DESC);
CREATE INDEX idx_tentativa_usuario ON tentativa_acesso(username, data_hora DESC);

-- 11. ÍNDICE COMPOSTO PARA CONSULTAS FREQUENTES
CREATE INDEX idx_documento_consulta_frequente 
ON documento(tipo_documento_id, unidade_organica_id, data_criacao DESC)
WHERE arquivado = false;

-- 12. ÍNDICE PARA BUSCA POR PERÍODO ACADÊMICO
CREATE INDEX idx_documento_periodo_academico 
ON documento(ano_academico_id, periodo_letivo_id, tipo_documento_id);

-- 13. VACUUM E ANALYZE CONFIGURADOS
-- Estatísticas serão atualizadas automaticamente pelo autovacuum
ALTER TABLE documento SET (autovacuum_enabled = true, toast.autovacuum_enabled = true);
ALTER TABLE log_auditoria SET (autovacuum_enabled = true, autovacuum_vacuum_scale_factor = 0.01);