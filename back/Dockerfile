# Usar uma imagem Python leve
FROM python:3.11-slim

# Definir o diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema para pacotes como opencv
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de requisitos (usando o nome com erro de digitação conforme o projeto)
COPY requeriments_updated.txt .

# Instalar as dependências do Python
RUN pip install --no-cache-dir -r requeriments_updated.txt

# Copiar o restante do código do backend
COPY . .

# Expor a porta que o Django usa
EXPOSE 8000

# Comando para rodar as migrações e iniciar o servidor
# Usamos 0.0.0.0 para que o servidor seja acessível fora do container
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
