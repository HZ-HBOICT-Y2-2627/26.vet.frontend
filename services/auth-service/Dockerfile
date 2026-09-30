FROM node:22-alpine

WORKDIR /app

# Build tools required for better-sqlite3 native module compilation
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY prisma.config.ts ./
COPY prisma/ ./prisma/
RUN DATABASE_URL=file:/tmp/build.sqlite npx prisma generate
# Prisma on Alpine generates a package.json in the output dir without "type":"module",
# causing tsc to emit CJS which Node then loads as ESM (root package.json). Override it.
RUN echo '{"type":"module"}' > generated/prisma/package.json
# Alpine's Prisma binary emits .ts import extensions; TypeScript @ts-nocheck files don't rewrite them.
# Normalize to .js so compiled ESM output resolves at runtime.
RUN find generated -name "*.ts" -exec sed -i \
    "s/from '\(\.[^']*\)\.ts'/from '\1.js'/g; s/from \"\(\.[^\"]*\)\.ts\"/from \"\1.js\"/g" {} +

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

RUN mkdir -p /data

EXPOSE 4001
ENTRYPOINT ["./entrypoint.sh"]
