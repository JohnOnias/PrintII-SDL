# Wrapper para permitir execução de `.
un_backend.ps1` dentro da pasta `back`
$wrapperDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$rootScript = Join-Path $wrapperDir '..\run_backend.ps1'

if (Test-Path $rootScript) {
    Write-Host "Chamando script principal em: $rootScript"
    & $rootScript
    exit $LASTEXITCODE
} else {
    Write-Error "Script principal não encontrado em $rootScript. Execute o script a partir da raiz do repositório: ..\\run_backend.ps1"
    exit 1
}
