# api-gateway-service

A single entry point that proxies incoming HTTP traffic to the backend services in this repo. It does not hold any data or state of its own — it's a thin routing layer built on Express and [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware).

## Quick Start

### Prerequisites

- Node.js 24 (current LTS)
- npm
- `vets_service` running locally (see `../vets_service/README.md`)
- `auth-service` running locally (see `../auth-service/README.md`)

### Installation

```bash
cp .env.example .env
npm install
npm run dev
```

The gateway will be available at <http://localhost:3000>.

### Build for Production

```bash
npm run build
npm start
```

### Run with Docker

The `Dockerfile` builds the gateway on `node:24-alpine`. `.env` is excluded from the image (see `.dockerignore`), so pass it in at runtime:

```bash
docker build -t api-gateway-service .
docker run -p 3000:3000 --env-file .env api-gateway-service
```

Inside a container, `localhost` refers to the container itself, not your machine. If `vets_service` and `auth-service` run on your host, override the upstream URLs with `host.docker.internal`:

```bash
docker run -p 3000:3000 --env-file .env \
  -e VETS_SERVICE_URL=http://host.docker.internal:4000 \
  -e AUTH_SERVICE_URL=http://host.docker.internal:4001 \
  api-gateway-service
```

---

## Routing

| Path | Proxied to | Auth required |
| --- | --- | --- |
| `/auth` | `auth-service` (`AUTH_SERVICE_URL`) | No — must stay reachable so anyone can register/log in |
| `/vets` | `vets_service` (`VETS_SERVICE_URL`) | GET: no — POST/PUT/DELETE: yes |
| `/treatments` | `vets_service` (`VETS_SERVICE_URL`) | GET: no — POST/PUT/DELETE: yes |
| `/appointment-types` | `vets_service` (`VETS_SERVICE_URL`) | GET: no — POST/PUT/DELETE: yes |
| `/my` | `vets_service` (`VETS_SERVICE_URL`) | Yes, also GET — personal data of the logged-in user |
| `/health` | handled locally, reports gateway status and configured upstreams | No |

Requests to any other path receive a `404`.

This is a pass-through proxy — it doesn't re-implement each route, it just forwards matching paths (any method) to the upstream service and streams back its response, including error responses. Each upstream service is the source of truth for its own request validation and business logic.

Because `express.json()` runs before the proxy (so `/health` and other local routes can read a JSON body), request bodies are already parsed by the time they reach the proxy. The proxy re-serializes them via `http-proxy-middleware`'s `fixRequestBody` (wired into `on.proxyReq`) — without it, write requests forwarded through the gateway would hang waiting for a body that was already consumed. Both `src/routes/vets.ts` and `src/routes/auth.ts` need this.

See `src/routes/vets.ts` / `src/routes/auth.ts` for the proxy definitions and `src/server.ts` for how they're mounted.

---

## Authentication

`auth-service` issues JWTs (`POST /auth/register`, `POST /auth/login`, `GET /auth/me`). The gateway proxies `/auth` through without checking anything, so anyone can register and log in.

Reading `vets_service` data (`GET`) is public, so the website can show vets and appointment types to every visitor. Changing data (`POST`, `PUT`, `DELETE`) is protected by `src/middleware/authenticate.ts` (see `src/server.ts`). Such a request must send the token it got from register or login:

```http
Authorization: Bearer <token>
```

Without a valid token the gateway answers `401` to a write request and the request never reaches `vets_service`.

The gateway verifies the token **locally**: it holds the same `JWT_SECRET` as `auth-service`, so it can check the signature itself instead of calling `auth-service` on every request — no extra network call, and writes keep working even while `auth-service` is down. The flip side is that both services must use the same `JWT_SECRET`.

`/my` (e.g. `/my/pets`) always needs a token. After verifying it, `authenticate` sets the `X-User-Email` header from the token, so `vets_service` knows whose data to return. It overwrites any `X-User-Email` the client sent, so nobody can pretend to be someone else.

`cors()` is mounted before `authenticate`, so browser preflight (`OPTIONS`) requests are answered without a token.

---

## Environment Variables

```env
PORT=3000
NODE_ENV=development

# Downstream services
VETS_SERVICE_URL=http://localhost:4000
AUTH_SERVICE_URL=http://localhost:4001

# JWT – must be the same value as in auth-service
JWT_SECRET=dev-secret-change-in-production
```

---

## Dependencies

### Production

- **express** — web framework
- **http-proxy-middleware** — request proxying
- **jsonwebtoken** — verifies the JWTs issued by `auth-service`
- **cors** — CORS middleware
- **dotenv** — loads `.env`

### Development

- **typescript**, **ts-node-dev** — TypeScript tooling

---

## Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build         # Compile TypeScript
npm start             # Run compiled build
npm run type-check    # TypeScript check without building
```

---

## License

MIT
