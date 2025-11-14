# Dockerfile
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia package.json e package-lock, se existir
COPY package*.json ./

# Instala dependências
RUN npm install --production

# Copia o resto do código
COPY . .

# Porta interna
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
