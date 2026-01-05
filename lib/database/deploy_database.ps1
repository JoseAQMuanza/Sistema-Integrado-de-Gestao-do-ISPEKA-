# deploy_database.ps1 - Script PowerShell para Windows

# Configurações
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptsDir = Join-Path $ScriptDir "scripts"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogFile = Join-Path $ScriptDir "deploy_$Timestamp.log"

# Função para log
function Log-Message {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
    Add-Content -Path $LogFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message"
}

# 1. VERIFICAR SE DOCKER ESTÁ INSTALADO
Log-Message "1. Verificando dependências..." -Color Yellow

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Log-Message "   ❌ Docker não encontrado!" -Color Red
    Log-Message "   Instale Docker Desktop: https://www.docker.com/products/docker-desktop/" -Color Red
    exit 1
}

if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Log-Message "   ⚠️  Docker Compose não encontrado, usando docker compose (nova versão)" -Color Yellow
    $DockerComposeCmd = "docker compose"
} else {
    $DockerComposeCmd = "docker-compose"
}

# 2. PARAR CONTAINERS EXISTENTES
Log-Message "2. Parando containers existentes..." -Color Yellow
try {
    Invoke-Expression "$DockerComposeCmd down" 2>&1 | Out-Null
    Log-Message "   ✅ Containers parados" -Color Green
} catch { Log-Message "Nenhum container em execução" -Color Yellow }

# 3. VERIFICAR SE PORTA 5432 ESTÁ LIVRE
Log-Message "3. Verificando porta 5432..." -Color Yellow
$PortInUse = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if ($PortInUse) {
    Log-Message "   ❌ Porta 5432 já está em uso!" -Color Red
    Log-Message "   Processo usando a porta:" -Color Red
    Get-Process -Id $PortInUse.OwningProcess | Select-Object Name, Id
    Log-Message "   Execute: Stop-Process -Id [ID] -Force" -Color Red
    exit 1
}

# 4. INICIAR CONTAINERS
Log-Message "4. Iniciando PostgreSQL..." -Color Yellow
Set-Location $ScriptDir

try {
    Invoke-Expression "$DockerComposeCmd up -d"
    Log-Message "   ✅ Containers iniciados" -Color Green
} catch {
    Log-Message "   ❌ Erro ao iniciar containers: $_" -Color Red
    exit 1
}

# 5. AGUARDAR POSTGRESQL FICAR PRONTO
Log-Message "5. Aguardando PostgreSQL ficar pronto..." -Color Yellow
$Timeout = 60
$StartTime = Get-Date
$Ready = $false

do {
    try {
        $Result = docker exec sigd_postgres pg_isready -U sigd_admin -d sigd_ispeka 2>$null
        if ($LASTEXITCODE -eq 0) {
            $Ready = $true
            break
        }
    } catch {
        # Ignora erros e continua tentando
    }
    
    Write-Host "   ." -NoNewline -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
} while (((Get-Date) - $StartTime).TotalSeconds -lt $Timeout)

if ($Ready) {
    Log-Message "`n   ✅ PostgreSQL está pronto!" -Color Green
} else {
    Log-Message "`n   ❌ Timeout - PostgreSQL não respondeu em $Timeout segundos" -Color Red
    Log-Message "   Verifique logs: docker logs sigd_postgres" -Color Red
    exit 1
}

# 6. EXECUTAR SCRIPTS SQL
Log-Message "6. Executando scripts SQL..." -Color Yellow

$Scripts = @(
    "00_setup_database.sql",
    "01_create_tables.sql",
    "02_hierarchical_tables.sql", 
    "03_academic_tables.sql",
    "04_doc_tables.sql",
    "05_quality_tables.sql",
    "06_aud_tables.sql",
    "07_triggers_functions.sql",
    "08_performance_indexes.sql",
    "09_init_data.sql"
)

foreach ($script in $Scripts) {
    $ScriptPath = Join-Path $ScriptsDir $script
    if (Test-Path $ScriptPath) {
        Log-Message "   📄 Executando: $script" -Color Cyan
        
        $Command = "docker exec -i sigd_postgres psql -U sigd_admin -d sigd_ispeka -f /docker-entrypoint-initdb.d/scripts/$script"
        
        try {
            Invoke-Expression $Command 2>&1 | Tee-Object -FilePath $LogFile -Append
            if ($LASTEXITCODE -eq 0) {
                Log-Message "   ✅ $script executado com sucesso" -Color Green
            } else {
                Log-Message "   ❌ Erro ao executar $script (código: $LASTEXITCODE)" -Color Red
                Log-Message "   Verifique o log: $LogFile" -Color Red
                exit 1
            }
        } catch {
            Log-Message "   ❌ Erro: $_" -Color Red
            exit 1
        }
    } else {
        Log-Message "   ❌ Script não encontrado: $ScriptPath" -Color Red
        exit 1
    }
}