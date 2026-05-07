# Rodando o Projeto com Docker (Windows)

Este guia explica como configurar e rodar o projeto PrintII-SDL utilizando Docker no Windows.

## Pré-requisitos

1.  **Docker Desktop:**
    *   Baixe e instale o [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/).
    *   Durante a instalação, certifique-se de habilitar o suporte ao **WSL 2** (recomendado).
2.  **WSL 2 (Opcional, mas recomendado):**
    *   Certifique-se de que o WSL 2 está instalado e atualizado.
3.  **Git:**
    *   Para clonar o repositório, caso ainda não o tenha feito.

---

## Como Rodar o Projeto

### 1. Clonar o Repositório
Abra o terminal (PowerShell, CMD ou terminal do WSL) e clone o repositório:
```bash
git clone https://github.com/JohnOnias/PrintII-SDL.git
cd PrintII-SDL
```

### 2. Iniciar os Containers
No diretório raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando:
```bash
docker compose up --build
```
*O parâmetro `--build` garante que as imagens sejam reconstruídas se houver mudanças nos Dockerfiles ou dependências.*

### 3. Acessar a Aplicação
Após o processo de build e inicialização (pode demorar alguns minutos na primeira vez):

*   **Frontend:** [http://localhost:5173](http://localhost:5173)
*   **Backend (API):** [http://localhost:8000](http://localhost:8000)
*   **Django Admin:** [http://localhost:8000/admin](http://localhost:8000/admin)

---

## Comandos Úteis

*   **Parar os containers:** `docker compose down`
*   **Rodar em segundo plano:** `docker compose up -d`
*   **Ver logs:** `docker compose logs -f`
*   **Executar migrações (se necessário):**
    ```bash
    docker compose exec backend python manage.py migrate
    ```
*   **Criar superusuário (Admin):**
    ```bash
    docker compose exec backend python manage.py createsuperuser
    ```

---

## Solução de Problemas (Troubleshooting)

### Portas Ocupadas
Se você receber um erro dizendo que as portas `8000` ou `5173` já estão em uso, verifique se não há outros serviços rodando nessas portas ou feche instâncias anteriores do projeto.

### Node Modules no Windows
O `docker-compose.yml` está configurado para ignorar a pasta `node_modules` local para evitar conflitos de arquitetura entre o Windows e o Linux (container). Se tiver problemas com o frontend, tente apagar a pasta `node_modules` local e rodar `docker compose up --build` novamente.

### Alterações no Backend
O Docker está configurado com volumes, o que significa que alterações feitas no código local serão refletidas automaticamente dentro do container (Hot Reload).
