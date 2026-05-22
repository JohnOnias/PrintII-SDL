# Rodando nessa sua carroça

Este guia mostra como executar o backend do projeto sem usar Docker.

## Pré-requisitos

- Windows
- Python 3.13 instalado e disponível no `PATH`
- Permissão para executar scripts PowerShell

## Passo a passo

1. Abra o PowerShell e vá para a raiz do projeto:
   ```powershell
   cd C:\Users\IFCE-Lab4\Downloads\PrintII-SDL
   ```

2. Permita a execução de scripts apenas para esta sessão:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
   ```

3. Execute o script de inicialização do backend:
   ```powershell
   .\run_backend.ps1
   ```

## O que o script faz

- cria/ativa o virtualenv local em `back/.venv`
- atualiza `pip`, `setuptools`, `wheel` e `setuptools_scm`
- tenta instalar `Pillow` e `mysqlclient` usando rodas binárias compatíveis
- se necessário, instala apenas as dependências restantes do `requirements_updated.txt`
- aplica migrações Django
- inicia o servidor de desenvolvimento em `http://0.0.0.0:8000/`

## Observações

- `Pillow==10.2.0` e `mysqlclient==2.2.4` não têm rodas binárias disponíveis para Python 3.13.
- O script está preparado para instalar versões compatíveis mais recentes quando isso for possível.
- Se ocorrerem erros de compilação do `mysqlclient`, o script tentará usar a melhor alternativa disponível.

## Local de execução

- O backend roda a partir da pasta `back`
- O arquivo de configuração principal do backend é `back/manage.py`
- As dependências estão listadas em `back/requirements_updated.txt`

## Dica rápida

Se quiser reexecutar o backend depois de parar o servidor, basta rodar novamente:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
.\run_backend.ps1
```
