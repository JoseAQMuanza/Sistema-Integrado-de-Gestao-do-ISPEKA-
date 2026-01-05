-- ============================================
-- DADOS INICIAIS DO SISTEMA
-- Base legal angolana e estrutura do ISPEKA
-- ============================================

-- 1. INSTITUIÇÃO ISPEKA
INSERT INTO instituicao (
    nome_completo, 
    sigla, 
    nuit,
    endereco_completo,
    municipio,
    provincia,
    telefone,
    email_institucional,
    data_criacao,
    licenca_operacao,
    status_legal
) VALUES (
    'Instituto Superior Politécnico de Educação e Cidadania',
    'ISPEKA',
    '54123456789', -- NUIT exemplo
    'Rua da Independência, Nº 123, Bairro Popular',
    'Viana',
    'Luanda',
    '+244 222 123 456',
    'geral@ispeka.edu.ao',
    '2010-01-15',
    'DESPACHO Nº 45/10/MESCTI',
    'Licenciada'
);

-- 2. PERFIS DE USUÁRIO (Base legal angolana)
INSERT INTO perfil_usuario (codigo_perfil, nome_perfil, nivel_hierarquico, tipo_acesso, fundamento_legal, responsabilidades) VALUES
-- Nível Estratégico
('DIR-GERAL', 'Direção Geral', 1, 'Estratégico', 
 'Artigo 45º do Regime Jurídico das IES - Órgão máximo de gestão institucional',
 'Aprovação final de documentos oficiais, validação de relatórios institucionais, assinatura institucional'),

-- Nível Tático
('CHEFE-DEPT', 'Chefe de Departamento', 2, 'Tático',
 'Artigo 67º - Responsável pela gestão científica e pedagógica do departamento',
 'Validação de documentos departamentais, submissão de relatórios, disponibilização de evidências à Qualidade'),

-- Nível Tático-Operacional
('COORD-CURSO', 'Coordenador de Curso', 3, 'Tático-Operacional',
 'Artigo 72º - Coordenação pedagógica e curricular dos cursos',
 'Submissão e validação de actas e relatórios do curso, geração de documentação académica'),

-- Nível Operacional
('DOCENTE', 'Docente', 4, 'Operacional',
 'Artigo 85º - Agentes executores do processo de ensino-aprendizagem',
 'Submissão de actas, relatórios e documentos pedagógicos, consulta de documentos autorizados'),

-- Perfis funcionais
('SECRETARIA', 'Secretaria', 3, 'Tático-Operacional',
 'Regulamento Interno do ISPEKA - Apoio à gestão documental',
 'Registo de documentos, controlo de prazos, arquivamento, atendimento ao público'),

('QUALIDADE', 'Qualidade', 2, 'Tático',
 'Sistema de Garantia da Qualidade do ISPEKA',
 'Gestão de auditorias, controlo de não conformidades, relatórios de qualidade'),

('SYS-ADMIN', 'Administrador Sistema', 1, 'Estratégico',
 'Regulamento de TI do ISPEKA',
 'Gestão de usuários, configuração do sistema, backups, suporte técnico');

-- 3. CATEGORIAS DOCUMENTAIS
INSERT INTO categoria_documental (codigo_categoria, nome_categoria, descricao, prazo_conservacao, destino_final, classificacao_legal) VALUES
('ACAD-1', 'Documentos Académicos Permanentes', 'Documentos com valor histórico e legal permanente', 100, 'Arquivo Permanente', 'Público'),
('ACAD-2', 'Documentos Académicos Temporários', 'Documentos académicos com prazo de conservação', 10, 'Reavaliação', 'Público'),
('ADM-1', 'Documentos Administrativos', 'Actas, despachos, memorandos institucionais', 15, 'Reavaliação', 'Restrito'),
('QUAL-1', 'Documentos da Qualidade', 'Relatórios de auditoria, não conformidades, planos de melhoria', 10, 'Arquivo Permanente', 'Restrito'),
('INST-1', 'Documentos Institucionais', 'Relatórios anuais, estatísticas, documentos para o MESCTI', 30, 'Arquivo Permanente', 'Público');

-- 4. TIPOS DE DOCUMENTO (Escopo do sistema)
INSERT INTO tipo_documento (codigo_tipo, nome_tipo, descricao, categoria_documental_id, area_aplicacao, template_obrigatorio, numeracao_automatica) VALUES
-- Académicos
('DEC-MAT', 'Declaração de Matrícula', 'Declaração de matrícula do estudante', 1, 'Académico', true, true),
('CERT-CONC', 'Certificado de Conclusão', 'Certificado de conclusão de curso', 1, 'Académico', true, true),
('HIST-ACAD', 'Histórico Académico', 'Histórico completo das disciplinas e notas', 1, 'Académico', true, true),
('ACTA-EXAME', 'Acta de Exame', 'Acta de resultados de exames', 2, 'Académico', true, true),
('PAUTA', 'Pauta de Notas', 'Pauta oficial de notas', 2, 'Académico', true, true),

-- Administrativos
('ACTA-REUN', 'Acta de Reunião', 'Acta de reuniões institucionais', 3, 'Administrativo', true, true),
('DESPACHO', 'Despacho', 'Despacho administrativo', 3, 'Administrativo', true, true),
('MEMORANDO', 'Memorando', 'Comunicação interna', 3, 'Administrativo', true, true),
('OFICIO', 'Ofício', 'Comunicação externa oficial', 3, 'Administrativo', true, true),

-- Qualidade
('REL-AUDIT', 'Relatório de Auditoria', 'Relatório de auditoria interna/externa', 4, 'Qualidade', true, true),
('NC-FORM', 'Formulário Não Conformidade', 'Registro de não conformidade', 4, 'Qualidade', true, true),
('PLAN-MELH', 'Plano de Melhoria', 'Plano de ações de melhoria', 4, 'Qualidade', true, true),

-- Institucionais
('REL-ANUAL', 'Relatório Anual', 'Relatório anual de atividades', 5, 'Institucional', true, true),
('ESTAT-INST', 'Estatísticas Institucionais', 'Estatísticas académicas e administrativas', 5, 'Institucional', true, true),
('DOC-MESCTI', 'Documento para MESCTI', 'Documentos oficiais para o Ministério', 5, 'Institucional', true, true);

-- 5. USUÁRIO ADMINISTRADOR INICIAL
-- Senha: Admin@ISPEKA2024 (será hasheada na aplicação)
INSERT INTO usuario (
    numero_identificacao,
    tipo_identificacao,
    nome_completo,
    genero,
    data_nascimento,
    nacionalidade,
    telefone_principal,
    email_institucional,
    cargo_institucional,
    username,
    password_hash,
    ativo
) VALUES (
    '005123456LA045',
    'BI',
    'Administrador do Sistema SIGD',
    'M',
    '1980-01-01',
    'Angolana',
    '+244 923 456 789',
    'admin@sigd.ispeka.edu.ao',
    'Administrador do Sistema',
    'admin',
    -- Hash será gerado na aplicação, este é apenas placeholder
    '$2b$12$TemporaryHashForInitialSetup',
    true
);

-- 6. ASSOCIAR ADMIN A PERFIL SYS-ADMIN
INSERT INTO usuario_perfil (usuario_id, perfil_id, ativo)
SELECT u.id, p.id, true
FROM usuario u, perfil_usuario p
WHERE u.username = 'admin' AND p.codigo_perfil = 'SYS-ADMIN';

-- 7. ANO ACADÉMICO ATUAL
INSERT INTO ano_academico (ano, data_inicio, data_fim, ativo, deliberacao_abertura) VALUES
('2024-2025', '2024-09-02', '2025-08-31', true, 'DELIBERAÇÃO Nº 01/CONSU/2024');

-- 8. PERÍODOS LETIVOS
INSERT INTO periodo_letivo (ano_academico_id, periodo, numero_periodo, data_inicio, data_fim, ativo) 
SELECT 
    aa.id,
    periodo,
    numero,
    data_inicio,
    data_fim,
    true
FROM ano_academico aa,
(VALUES 
    ('1º Semestre', 1, '2024-09-02', '2024-12-20'),
    ('2º Semestre', 2, '2025-01-06', '2025-05-30')
) AS p(periodo, numero, data_inicio, data_fim)
WHERE aa.ano = '2024-2025';

-- 9. PERMISSÕES BASE (Base legal hierárquica)
-- Nota: Configurações detalhadas serão feitas via interface administrativa
INSERT INTO permissao_documento (perfil_id, tipo_documento_id, pode_criar, pode_visualizar, pode_editar, pode_aprovar, pode_assinatur)
SELECT 
    p.id as perfil_id,
    td.id as tipo_documento_id,
    -- Direção Geral: Acesso total
    CASE WHEN p.codigo_perfil = 'DIR-GERAL' THEN true ELSE false END as pode_criar,
    true as pode_visualizar, -- Todos podem visualizar documentos públicos
    CASE 
        WHEN p.codigo_perfil IN ('DIR-GERAL', 'SYS-ADMIN') THEN true
        ELSE false 
    END as pode_editar,
    CASE 
        WHEN p.codigo_perfil IN ('DIR-GERAL', 'CHEFE-DEPT') THEN true
        ELSE false 
    END as pode_aprovar,
    CASE 
        WHEN p.codigo_perfil = 'DIR-GERAL' THEN true
        ELSE false 
    END as pode_assinatur
FROM perfil_usuario p
CROSS JOIN tipo_documento td
WHERE p.codigo_perfil IN ('DIR-GERAL', 'CHEFE-DEPT', 'COORD-CURSO', 'DOCENTE', 'SECRETARIA', 'QUALIDADE', 'SYS-ADMIN');

-- 10. CONFIGURAÇÕES DO SISTEMA
CREATE TABLE IF NOT EXISTS configuracao_sistema (
    chave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    tipo VARCHAR(50) CHECK (tipo IN ('Texto', 'Numérico', 'Booleano', 'JSON', 'Data')),
    descricao TEXT,
    categoria VARCHAR(50),
    editavel BOOLEAN DEFAULT true,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO configuracao_sistema (chave, valor, tipo, descricao, categoria) VALUES
-- Geral
('system.name', 'SIGD-ISPEKA', 'Texto', 'Nome do sistema', 'Geral'),
('system.version', '1.0.0', 'Texto', 'Versão do sistema', 'Geral'),
('system.language', 'pt-PT', 'Texto', 'Idioma padrão', 'Geral'),

-- Documentos
('doc.max_size_mb', '50', 'Numérico', 'Tamanho máximo de documentos em MB', 'Documentos'),
('doc.allowed_extensions', 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png', 'Texto', 'Extensões permitidas', 'Documentos'),
('doc.retention_years', '10', 'Numérico', 'Anos de retenção padrão', 'Documentos'),
('doc.auto_numbering', 'true', 'Booleano', 'Numeração automática de documentos', 'Documentos'),

-- Segurança
('security.password.min_length', '8', 'Numérico', 'Comprimento mínimo da senha', 'Segurança'),
('security.password.require_special', 'true', 'Booleano', 'Exige caracteres especiais', 'Segurança'),
('security.session.timeout_minutes', '480', 'Numérico', 'Timeout da sessão em minutos', 'Segurança'),
('security.login.attempts', '5', 'Numérico', 'Tentativas de login antes de bloquear', 'Segurança'),

-- Integração
('integration.sync.interval_hours', '24', 'Numérico', 'Intervalo de sincronização em horas', 'Integração'),
('integration.api.enabled', 'false', 'Booleano', 'API de integração ativa', 'Integração'),

-- Qualidade
('quality.nc.response_days', '30', 'Numérico', 'Dias para resposta a não conformidades', 'Qualidade'),
('quality.audit.plan_months', '12', 'Numérico', 'Meses para planeamento de auditorias', 'Qualidade'),

-- Backup
('backup.automatic', 'true', 'Booleano', 'Backup automático ativo', 'Backup'),
('backup.retention_days', '30', 'Numérico', 'Dias de retenção de backups', 'Backup');