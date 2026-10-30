FROM node:20-alpine

WORKDIR /app

# Install sqlite3 tools
RUN apk add --no-cache sqlite

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY dist ./dist

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"

CMD ["node", "dist/index.js"]
