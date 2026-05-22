# Usar a imagem oficial do Python 3.11 slim como base
FROM python:3.11-slim

# Evitar prompts interativos
ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Definir o diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias para mysqlclient e outras bibliotecas
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    pkg-config \
    gcc \
    # Dependências necessárias para compilar e empacotar imagens do Pillow
    libjpeg-dev \
    zlib1g-dev \
    libtiff5-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    libopenjp2-7-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de requisitos
COPY requirements_updated.txt .

# Instalar as dependências do Python
RUN pip install --no-cache-dir -r requirements_updated.txt

# Copiar o restante do código do backend
COPY . .

# Expor a porta que o Django usa
EXPOSE 8000

# Comando para rodar as migrações e iniciar o servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
