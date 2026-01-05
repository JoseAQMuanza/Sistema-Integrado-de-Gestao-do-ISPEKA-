#!/bin/bash
# Script de deploy completo do banco de dados SIGD-ISPEKA

echo " INICIANDO DEPLOY DO BANCO DE DADOS SIGD-ISPEKA"
echo "=================================================="

# 1. Verificar dependências
echo "1. Verificando dependências..."
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL client (psql) não encontrado!"
    exit 1
fi

# 2. Solicitar credenciais
read -p "Usuário PostgreSQL (padrão: postgres): " admin
PGUSER=${PGUSER:-postgres}

read -sp "Senha do PostgreSQL: " 1234
echo
export PGPASSWORD

# 3. Executar scripts em ordem
SCRIPTS=(
    "00_setup_database.sql"
    "01_create_tables.sql"
    "02_hierarchical tables.sql"
    "03_academic_tables.sql"
    "04_doc_tables.sql"
    "05_quality_tables.sql"
    "06_aud_tables.sql"
    "07_triggers_functions.sql"
    "08_performance_indexes.sql"
    "09_init_data.sql"
)

echo "2. Executando scripts SQL..."
for script in "${SCRIPTS[@]}"; do
    if [ -f "database/$script" ]; then
        echo "   📄 Executando: $script"
        psql -h localhost -U $PGUSER -f "database/$script"
        if [ $? -ne 0 ]; then
            echo "   ❌ Erro ao executar $script"
            exit 1
        fi
    else
        echo "   ⚠️  Script não encontrado: $script"
    fi
done

echo ""
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "📊 INFORMAÇÕES DE ACESSO:"
echo "   Banco de dados: sigd_ispeka"
echo "   Schema: sigd"
echo "   Usuário admin: admin"
echo "   Senha inicial: Admin@ISPEKA2024"
echo ""
echo "⚠️  IMPORTANTE: Altere a senha do usuário admin no primeiro login!"