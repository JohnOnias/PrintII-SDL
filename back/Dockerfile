# Usar imagem oficial do Python (mais estável e leve que o Ubuntu puro)
FROM python:3.12-slim-bookworm

# Evitar prompts interativos e gerar logs em tempo real
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DEBIAN_FRONTEND=noninteractive

# Definir o diretório de trabalho
WORKDIR /app

# Instalar apenas as dependências do sistema necessárias para o mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    pkg-config \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de requisitos
COPY requeriments_updated.txt .

# Instalar as dependências do Python diretamente (sem venv necessário dentro do container)
RUN pip install --no-cache-dir -r requeriments_updated.txt

# Copiar o restante do código do backend
COPY . .

# Expor a porta que o Django usa
EXPOSE 8000

# Comando para rodar as migrações e iniciar o servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
