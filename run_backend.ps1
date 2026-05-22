# Script para rodar o backend localmente (sem Docker)
# - Cria/ativa um virtualenv em `back/.venv`
# - Tenta instalar `Pillow` a partir de wheel binário
# - Se falhar, tenta instalar via `pipwin` (pre-built wheels para Windows)
# - Instala o restante das dependências e inicia o servidor Django

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$backDir = Join-Path $scriptDir 'back'

if (-not (Test-Path $backDir)) {
    Write-Host "Diretório 'back' não encontrado em $scriptDir. Tentando usar diretório atual."
    $backDir = $scriptDir
}

Set-Location $backDir

Write-Host "Usando diretório: $PWD"

if (-not (Test-Path ".venv")) {
    Write-Host "Criando virtualenv em .venv..."
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao criar virtualenv"; exit $LASTEXITCODE }
}

# Ativar venv
Write-Host "Ativando virtualenv..."
. .\.venv\Scripts\Activate.ps1

Write-Host "Atualizando pip/setuptools/wheel..."
python -m pip install --upgrade pip setuptools wheel
python -m pip install --upgrade setuptools_scm

function Try-InstallPillowExact {
    Write-Host "Tentando instalar Pillow exatamente como no requirements..."
    python -m pip install --only-binary=:all: Pillow==10.2.0 -v
    return $LASTEXITCODE
}

function Try-InstallLatestPillowBinary {
    Write-Host "Tentando instalar a versão mais recente de Pillow disponível como wheel binário..."
    python -m pip install --only-binary=:all: --prefer-binary Pillow -v
    return $LASTEXITCODE
}

function Try-InstallPillow-WithPipwin {
    Write-Host "Tentando instalar Pillow via pipwin (fallback para Windows)..."
    python -m pip install --upgrade pipwin
    if ($LASTEXITCODE -ne 0) { Write-Host "Falha ao instalar pipwin"; return 1 }
    python -m pipwin install Pillow
    return $LASTEXITCODE
}

function Try-InstallMysqlclientExact {
    Write-Host "Tentando instalar mysqlclient exatamente como no requirements..."
    python -m pip install --only-binary=:all: mysqlclient==2.2.4 -v
    return $LASTEXITCODE
}

function Try-InstallLatestMysqlclientBinary {
    Write-Host "Tentando instalar a versão mais recente de mysqlclient disponível como wheel binário..."
    python -m pip install --only-binary=:all: --prefer-binary mysqlclient -v
    return $LASTEXITCODE
}

function Try-InstallMysqlclient-WithPipwin {
    Write-Host "Tentando instalar mysqlclient via pipwin (fallback para Windows)..."
    python -m pip install --upgrade pipwin
    if ($LASTEXITCODE -ne 0) { Write-Host "Falha ao instalar pipwin"; return 1 }
    python -m pipwin install mysqlclient
    return $LASTEXITCODE
}

function Build-Requirements-Without {
    param(
        [string[]]$excludePackages
    )

    $source = Join-Path $backDir 'requirements_updated.txt'
    $targetFileName = 'requirements_no_' + ($excludePackages -join '_and_') + '.txt'
    $target = Join-Path $backDir $targetFileName
    Get-Content $source |
        Where-Object {
            $line = $_
            if ($line -match '^(\s*#|\s*$)') { return $true }
            foreach ($pkg in $excludePackages) {
                if ($line -match "^\s*$pkg\s*(==|~=|>=|<=|!=).*" ) { return $false }
            }
            return $true
        } |
        Set-Content $target
    return $target
}

$pillowExit = Try-InstallPillowExact
$mysqlExit = Try-InstallMysqlclientExact
$useNoPillowRequirements = $false
$useNoMysqlclientRequirements = $false

if ($pillowExit -ne 0) {
    Write-Host "Falha ao instalar Pillow 10.2.0 como wheel. Tentando versão mais recente do Pillow binário..."
    $latestExit = Try-InstallLatestPillowBinary
    if ($latestExit -eq 0) {
        $useNoPillowRequirements = $true
    } else {
        Write-Host "Instalação da versão mais recente falhou. Tentando pip install normal..."
        python -m pip install --no-build-isolation Pillow
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Instalação direta falhou. Tentando pipwin..."
            $pipwinExit = Try-InstallPillow-WithPipwin
            if ($pipwinExit -ne 0) {
                Write-Error "Não foi possível instalar Pillow automaticamente.\nRecomendações:\n- Instale o Build Tools for Visual Studio (C++).\n- Ou baixe e instale manualmente a roda pré-compilada apropriada de https://www.lfd.uci.edu/~gohlke/pythonlibs/ e instale com pip.";
                exit 1
            }
        }
        $useNoPillowRequirements = $true
    }
}

if ($mysqlExit -ne 0) {
    Write-Host "Falha ao instalar mysqlclient 2.2.4 como wheel. Tentando versão mais recente do mysqlclient binário..."
    $latestMysqlExit = Try-InstallLatestMysqlclientBinary
    if ($latestMysqlExit -eq 0) {
        $useNoMysqlclientRequirements = $true
    } else {
        Write-Host "Instalação da versão mais recente falhou. Tentando pip install normal..."
        python -m pip install --no-build-isolation mysqlclient
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Instalação direta falhou. Tentando pipwin..."
            $pipwinExit = Try-InstallMysqlclient-WithPipwin
            if ($pipwinExit -ne 0) {
                Write-Error "Não foi possível instalar mysqlclient automaticamente.\nRecomendações:\n- Instale o MySQL Developer Headers (mysql.h) ou MySQL Server/Connector/C.\n- Ou baixe/instale manualmente a roda pré-compilada apropriada de https://www.lfd.uci.edu/~gohlke/pythonlibs/ e instale com pip.";
                exit 1
            }
        }
        $useNoMysqlclientRequirements = $true
    }
}

Write-Host "Instalando demais dependências do projeto..."
if ($useNoPillowRequirements -or $useNoMysqlclientRequirements) {
    $exclude = @()
    if ($useNoPillowRequirements) { $exclude += 'Pillow' }
    if ($useNoMysqlclientRequirements) { $exclude += 'mysqlclient' }
    $reqNoPillowOrMysql = Build-Requirements-Without -excludePackages $exclude
    if ((Get-Content $reqNoPillowOrMysql).Count -gt 0) {
        python -m pip install -r $reqNoPillowOrMysql
    } else {
        Write-Host "Nenhuma dependência adicional encontrada além de $($exclude -join ', '). Pulando instalação de requirements restantes."
    }
} else {
    python -m pip install -r requirements_updated.txt
}
if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao instalar requisitos"; exit $LASTEXITCODE }

Write-Host "Executando migrações e iniciando servidor Django..."
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
