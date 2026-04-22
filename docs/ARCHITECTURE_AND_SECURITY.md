# E-commerce Microservices — Architecture & Security

End-to-end notes for **this** repo (Spring Boot 3.3, Spring Cloud 2023, Netflix Eureka, Spring Cloud Gateway, HS256 JWT at the gateway only).

---

## 1. Textual architecture diagram

```
                    ┌─────────────────┐
                    │   Eureka :8761   │  service registry
                    └────────┬────────┘
                             │ register / discover
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
┌────▼────┐  ┌───────▼──────┐  ┌──────▼──────┐  ┌────▼─────┐ …
│ api-    │  │ user-service │  │ product-    │  │ order-   │
│ gateway │  │    :8081     │  │ service     │  │ service  │
│  :8080  │  │ H2/Postgres  │  │  :8082      │  │  :8085   │
└────┬────┘  └──────────────┘  └──────┬──────┘  └────┬─────┘
     │                                 │            │
     │  lb://user-service              │            │ Feign → user, product,
     │  lb://product-service           │            │ payment, notification
     │  lb://order-service             │            │
     │                                 ▼            ▼
Frontend / Postman ──HTTP──► Gateway ──HTTP──► each service (no JWT validation
(Vite, optional                           Eureka load-balances `lb://`
 VITE_API_BASE)                           Correlation-ID header propagated
```

**Not exposed through the gateway (by design):** `/api/internal/**` — order-service calls these via Feign + Eureka (`lb://product-service`, etc.), not via port 8080.

---

## 2. Request path: frontend → gateway → service → DB

1. Browser (or Postman) calls `http://localhost:8080/api/...` (or `VITE_API_BASE` + path).
2. **API Gateway** (`api-gateway`) matches a route in `application.yml`, resolves `lb://<service-name>` via Eureka, forwards the HTTP request.
3. **CorrelationIdGatewayFilter** ensures `X-Correlation-Id` (constant from `ecommerce-common`) is present on the downstream request and response.
4. **Spring Security WebFlux** runs **before** routing: OAuth2 Resource Server JWT validation for protected routes (see §4).
5. Target **microservice** handles MVC request; **Servlet** services load `CorrelationIdServletFilter` from `ecommerce-common` auto-config for MDC logging.
6. **JPA** persists to **H2** (default in `application.yml`) or **PostgreSQL** when using `SPRING_PROFILES_ACTIVE=local` with Docker Postgres (see `docker-compose.yml`).

---

## 3. Eureka’s role

- **eureka-server**: standalone registry (`@EnableEurekaServer`).
- Each client (`spring.application.name`) registers with `eureka.client.service-url.defaultZone` (e.g. `http://localhost:8761/eureka/`).
- Gateway and Feign use **logical names** (`user-service`, `product-service`, …) → Eureka returns instance host/port → **load-balanced** calls.

---

## 4. API Gateway role

- **Single entry** for public API prefixes: `/api/auth/**`, `/api/users/**`, `/api/products/**`, `/api/orders/**`.
- **JWT validation** (HS256) using `jwt.secret` — must match `user-service` signing secret.
- **CORS** for `localhost` / `127.0.0.1` any port (see `application.yml`).
- **Does not** implement business logic; only security, routing, correlation id.

---

## 5. Authentication flow (JWT) — project-specific

| Step | Where | What happens |
|------|--------|----------------|
| 1 | `user-service` `POST /api/auth/login` | `AuthController` loads user, checks password, `JwtService.createAccessToken` → HS256 JWT (`sub` = user id, `email` claim). |
| 2 | Gateway | `POST /api/auth/**` is **permitAll**; `PublicPathsBearerTokenConverter` **does not** parse Bearer on `/api/auth/**`, so login never fails due to a stale cookie token. |
| 3 | Client | Stores token (frontend: `localStorage` key `ecommerce_access_token`). Sends `Authorization: Bearer <token>` only when explicitly requested (`fetchJson(..., { auth: true })`). |
| 4 | Gateway protected route | Standard bearer converter extracts JWT → `ReactiveJwtDecoder` (`GatewayJwtConfig`) verifies signature + expiry → request is **authenticated**. |
| 5 | Downstream services | **No** Spring Security OAuth2 in `product-service`, `order-service`, etc. They **trust** the network path; **only the gateway enforces JWT** for public API routes. |

---

## 6. Service-to-service flow (sync vs async)

### 6.1 Who calls whom (summary)

| Caller | Callee | Mechanism | Typical path |
|--------|--------|-------------|--------------|
| Browser/Postman | Gateway | HTTP | `/api/...` |
| Gateway | user / product / order | HTTP via Eureka `lb://` | same paths |
| order-service | user-service | **Feign** sync | `GET /api/users/{id}` |
| order-service | product-service | **Feign** sync | `GET /api/products/{id}`, `POST /api/internal/products/{id}/reserve`, `.../release` |
| order-service | payment-service | **Feign** sync | `POST /api/internal/payments` |
| order-service | notification-service | **Feign** sync (if Kafka off) | `POST /api/internal/notifications` |
| order-service | Kafka | **Async** (if `app.notification.use-kafka=true`) | topic `order-events` |
| notification-service | Kafka | **Async** consumer | `@KafkaListener` on same topic |

### 6.2 Example: Login → token → Product → Order (real sequence)

1. **`POST /api/auth/login`** (via gateway → user-service): returns `TokenResponse` with `accessToken`.
2. **Catalog browse:** `GET /api/products` — gateway **permits all**; `PublicPathsBearerTokenConverter` skips JWT parsing on this path so an **expired** token in the browser does not break public catalog reads.
3. **Create product (optional demo):** `POST /api/products` with `{ auth: true }` → gateway requires **authenticated** JWT.
4. **List or place orders:** `GET/POST /api/orders` with `{ auth: true }` → gateway requires JWT.
5. **Inside `POST /api/orders`:** `OrderPlacementService.placeOrder`:
   - `userClient.getUser(userId)` → user-service  
   - For each line: `productClient.getProduct` → product-service  
   - Save order → **reserve** stock on each line → **paymentClient.pay** → mark CONFIRMED → **notification** HTTP **or** Kafka publish.

**Authorization propagation:** `FeignClientConfig` copies incoming servlet `Authorization` and MDC correlation id to outbound Feign calls — so the **same** JWT the user sent to the gateway reaches user-service when order-service validates the user (user-service still does not validate JWT in this codebase).

---

## 7. Class-level map (per service)

### 7.1 api-gateway

| Class | Role | Called by |
|-------|------|-----------|
| `GatewaySecurityConfig` | WebFlux security: `permitAll` vs `authenticated`, OAuth2 resource server JWT | Spring context |
| `GatewayJwtConfig` | `ReactiveJwtDecoder` with HS256 secret (min 32 UTF-8 bytes) | Spring injects into OAuth2 RS |
| `PublicPathsBearerTokenConverter` | On public paths, skip bearer extraction to avoid 401 from invalid token before `permitAll` | Injected into security filter chain |
| `CorrelationIdGatewayFilter` | Global filter; mutable headers + correlation id | Gateway filter chain |

### 7.2 user-service

| Class | Role |
|-------|------|
| `AuthController` | `/api/auth/login` → JWT |
| `UserController` | CRUD `/api/users` |
| `JwtService` | Sign JWT with `jwt.secret` |
| `UserRepository` | JPA |
| `SecurityBeansConfig` | `PasswordEncoder` only (no HTTP security config in repo) |

### 7.3 product-service

| Class | Role |
|-------|------|
| `ProductController` | Public catalog CRUD `/api/products` |
| `ProductCatalogService` | `@Cacheable` list/get |
| `InternalStockController` | `/api/internal/products/...` reserve/release (Feign from order) |
| `ProductRepository` | JPA |

### 7.4 order-service

| Class | Role |
|-------|------|
| `OrderController` | `/api/orders` REST |
| `OrderPlacementService` | Saga-style orchestration + compensating release |
| `*Client` (Feign) | Remote calls |
| `FeignClientConfig` | Correlation + `Authorization` propagation |
| `KafkaOrderEventPublisher` / `OrderEventsKafkaListener` | Optional async path |

### 7.5 payment-service

| Class | Role |
|-------|------|
| `PaymentController` | `/api/internal/payments` |
| `PaymentProcessingService` | Stub idempotent pay / fail |

### 7.6 notification-service

| Class | Role |
|-------|------|
| `NotificationController` | `/api/internal/notifications` (sync from order when Kafka off) |
| `OrderEventsKafkaListener` | Kafka consumer when `app.notification.use-kafka=true` |

### 7.7 ecommerce-common

| Class | Role |
|-------|------|
| `CorrelationIdServletFilter` + `CorrelationIdAutoConfiguration` | Servlet apps: MDC + response header |

---

## 8. One example class explained in full: `PublicPathsBearerTokenConverter`

**Problem it solves:** Spring’s OAuth2 resource server runs a **BearerTokenAuthenticationFilter** that validates JWTs **even on** `permitAll()` routes if a `Authorization: Bearer` header is present. A logged-in user with an **expired** token would get **401** on `GET /api/products` before the “public” rule applies.

**Behavior:** For `/api/auth/**`, `POST /api/users`, and `GET /api/products/**`, return `Mono.empty()` so no `BearerTokenAuthenticationToken` is built → user is **anonymous** → `permitAll()` applies. For all other paths, delegate to `ServerBearerTokenAuthenticationConverter` (normal JWT extraction).

**Who calls it:** Registered in `GatewaySecurityConfig` via `.bearerTokenConverter(publicPathsBearerTokenConverter)`.

---

## 9. Debugging checklist — 401 after login

### 9.1 Likely causes (this repo)

1. **Missing `Authorization` header** — Frontend only attaches JWT when `fetchJson(..., { auth: true })`. **Orders** use `auth: true`; **product list** does not (public). **POST /api/products** uses `auth: true`. If you call protected routes without `auth: true` or forget the header in Postman → **401**.
2. **Token expired** — `AuthContext` / `getToken` strip expired tokens → no header → **401** on protected routes.
3. **`jwt.secret` mismatch** — user-service signs with one secret, gateway verifies with another → signature failure → **401** (login can still “work” on user-service if only gateway is wrong).
4. **JWT `alg` mismatch (HS256 vs HS384/HS512)** — `api-gateway` uses `NimbusReactiveJwtDecoder` with **HS256**. If `JwtService` signs with **HS384** (JJWT can infer a stronger HMAC from a long `jwt.secret`), the gateway returns **`invalid_token`** for protected routes while **`/api/auth/login` still returns 200**. Fix: sign explicitly with **`Jwts.SIG.HS256`** in `JwtService` (see user-service code), then **restart user-service**.
5. **Calling service port directly** for a path that you *think* is protected — product/order services **do not** enforce JWT; **401** on `/api/orders` almost certainly originates from **gateway** (port **8080**), not 8085.
6. **Wrong base URL** — Hitting order-service :8085 without JWT returns **200** (no security). Hitting gateway :8080 without JWT returns **401**. Compare which base URL the UI uses (`VITE_API_BASE` vs Vite proxy).
7. **YAML / profile** — Different `jwt.secret` under another profile or env override.
8. **Gateway logging:** Security DEBUG levels live under root `logging.level` in `api-gateway` `application.yml` (so OAuth2/JWT rejection reasons appear in logs).

### 9.2 Step-by-step debug

1. **Confirm 401 source:** Response headers often include `WWW-Authenticate` from Spring Security on gateway. Check request URL host/port.
2. **curl the gateway** with and without header:

```bash
TOKEN='<paste accessToken>'

curl -i "http://127.0.0.1:8080/api/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

3. **Decode JWT** (payload only, for exp / sub): [jwt.io](https://jwt.io) or `jq` on middle segment — verify `exp` not in the past.
4. **Gateway logs:** Enable `logging.level.org.springframework.security=DEBUG` and `org.springframework.security.oauth2=DEBUG` at **root** `logging:` in `api-gateway` `application.yml`.
5. **Breakpoints:** `NimbusReactiveJwtDecoder` decode path; `AuthenticationWebFilter`; first line of `OrderController.create` (if never hit, 401 is before route).

### 9.3 Fixes (patterns)

**A. Frontend — always send token on protected routes**

```ts
await fetchJson('/api/orders', { auth: true });
```

**B. Align secrets (gateway + user-service)**

Same value in:

- `api-gateway/src/main/resources/application.yml` → `jwt.secret`
- `user-service/src/main/resources/application.yml` → `jwt.secret`

**C. Postman**

- Authorization tab → Bearer Token → paste raw token (no extra quotes).
- URL must be **gateway** `http://localhost:8080/api/orders` for JWT enforcement.

**D. Optional: send token on all API calls (if you prefer)**

You could change `fetchJson` to always attach `Authorization` when a token exists; public routes still work because gateway treats GET `/api/products` as anonymous-friendly (converter skips bearer on that path only — if you always send a **valid** token, you could instead use default converter; current design favors expired-token + public catalog UX).

---

## 10. File index (quick navigation)

| Concern | File |
|---------|------|
| Gateway routes + CORS + JWT secret | `api-gateway/src/main/resources/application.yml` |
| Gateway security rules | `api-gateway/src/main/java/org/example/gateway/GatewaySecurityConfig.java` |
| JWT decoder bean | `api-gateway/src/main/java/org/example/gateway/GatewayJwtConfig.java` |
| Public-path bearer skip | `api-gateway/src/main/java/org/example/gateway/PublicPathsBearerTokenConverter.java` |
| Login + token | `user-service/.../AuthController.java`, `JwtService.java` |
| Feign auth propagation | `order-service/.../feign/FeignClientConfig.java` |
| Order saga | `order-service/.../OrderPlacementService.java` |
| Frontend auth header | `frontend/src/api/client.ts`, `frontend/src/auth/AuthContext.tsx` |

---

*Generated from repository structure and sources; keep this doc updated when you add new routes or JWT validation on individual services.*
