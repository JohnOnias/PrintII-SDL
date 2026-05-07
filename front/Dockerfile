# Usar uma imagem Node leve
FROM node:20-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código do frontend
COPY . .

# Expor a porta que o Vite usa
EXPOSE 5173

# Comando para rodar o servidor de desenvolvimento
# O parâmetro --host é necessário para o Docker
CMD ["npm", "run", "dev", "--", "--host"]
