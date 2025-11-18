FROM node:20-bookworm-slim
WORKDIR /app

# Install dependencies first to leverage caching
COPY Frontend/package*.json ./
RUN npm ci

# Copy the remainder of the frontend
COPY Frontend/. .

ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "dev"]
