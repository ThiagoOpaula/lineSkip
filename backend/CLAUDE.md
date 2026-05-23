# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
# Build
cargo build

# Run all unit tests (excludes integration tests needing DB/Redis)
cargo test --lib

# Run integration tests (router-level, no DB needed)
cargo test --test api

# Run all tests
cargo test

# Run tests requiring Postgres + Redis
cargo test -- --ignored

# Run a specific test
cargo test test_name
cargo test --lib errors::tests::test_not_found_response

# Check compilation without running
cargo check

# Format
cargo fmt
```

## Project Structure

```
backend/
├── src/
│   ├── main.rs          # Binary entrypoint: tracing init, DB, Redis, server bind
│   ├── lib.rs           # Library root — exports all modules for integration tests
│   ├── db/
│   │   └── connection.rs   # PgPool creation from DATABASE_URL env var
│   ├── dto/             # Request/response types (serde-based)
│   │   ├── auth.rs      # LoginRequest, RegisterRequest, UserResponse
│   │   ├── ticket.rs    # CreateTicketRequest, UpdateTicketRequest, TicketResponse
│   │   ├── order.rs     # CreateOrderRequest, OrderResponse
│   │   └── payment.rs   # PaymentRequest, PaymentResponse
│   ├── errors.rs        # ApiError enum (NotFound, Conflict, Internal, Unauthorized)
│   ├── handlers/        # Axum request handlers
│   │   ├── auth.rs      # POST /auth/login, POST /auth/register
│   │   ├── tickets.rs   # CRUD /tickets
│   │   ├── orders.rs    # Create/List/Get /orders (QR generation, Redis caching)
│   │   └── payment.rs   # POST /payment/process
│   ├── models/          # DB row structs (sqlx::FromRow)
│   │   ├── user.rs      # find_by_id, create, find_by_username, find_by_email
│   │   ├── ticket.rs    # find_all, find_by_id, create, update, delete
│   │   └── order.rs     # find_all, find_by_id, create
│   ├── routes/
│   │   └── api.rs       # Router construction, route nesting
│   ├── services/        # Business logic
│   │   ├── auth_service.rs   # register_user, login_user, verify_user
│   │   ├── jwt_service.rs    # JWT generate/validate (24h expiry)
│   │   ├── payment_service.rs # Mock payment processing
│   │   ├── qr_service.rs     # QR code generation (base64 PNG data URLs)
│   │   └── cache_service.rs  # Redis async caching via ConnectionManager
│   ├── state.rs         # AppState { db: PgPool, cache: CacheService }
│   └── utils/
│       └── hash.rs      # Argon2 password hashing
├── migrations/          # SQLx migrations
│   ├── *createUsersTable.up.sql
│   ├── *updateUsersTable.up.sql   # adds email, password columns
│   ├── *createTicketsTable.up.sql
│   └── *createOrdersTable.up.sql
└── tests/
    └── api.rs           # Integration tests (router-level, missing Extension → 500)
```

## Architecture

**Hybrid binary/library crate** (`src/main.rs` + `src/lib.rs`). Integration tests in `tests/` import via `lineskip_backend::`.

### Request flow
```
HTTP → Router (routes/api.rs) → Handler (handlers/*.rs) → Service (services/*.rs) → Response
                                     ↕                           ↕
                                DTO models                  DB models (models/*.rs)
```

**State injection**: `AppState` (containing `PgPool` + `CacheService`) is injected via `axum::Extension` — all handlers receive it as `Extension(state): Extension<AppState>`.

### Key patterns

- **Handlers** are thin — extract params, call services/models, return DTOs
- **Models** contain raw SQL queries (sqlx query_as) — no ORM
- **Services** contain business logic with error types deriving `thiserror::Error`
- **DTOs** are pure serde structs — `Deserialize` for requests, `Serialize` for responses
- **Errors**: `services::*::*Error` → `ApiError` (via `From` impls) → HTTP response with JSON body `{"error": "..."}`
- **Tests** use `#[cfg(test)] mod tests` inside source files for unit tests, `tests/api.rs` for integration

### Dependencies

| Crate | Version | Purpose |
|-------|---------|---------|
| axum | 0.7 | HTTP framework |
| sqlx | 0.8 | PostgreSQL with tokio-rustls |
| tokio | 1.52 | Async runtime (full features) |
| redis | 0.25 | Caching with `tokio-comp` + `connection-manager` features |
| rust-argon2 | 2.1 | Password hashing |
| jsonwebtoken | 9.3 | JWT auth |
| qrcode + image | 0.13 / 0.24 | QR generation to base64 PNG |
| serde / serde_json | 1.0 | Serialization |
| tracing / tracing-subscriber | 0.1 / 0.3 | Structured logging |

## Environment Variables

```
DATABASE_URL=postgres://user:pass@localhost/db
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your-secret-key
```

- `CacheService::new()` panics on `AppState::new()` if Redis is unreachable
- `db::connection::establish_connection()` panics if DATABASE_URL is missing or unreachable

## Important Notes

- **CacheService is async** — all cache operations use `redis::aio::ConnectionManager`. Never use synchronous Redis commands.
- **Auth errors**: Wrong credentials return `AuthError::InvalidCredentials` (mapped to HTTP 401). Do NOT leak whether the username or password was wrong.
- **QR codes** are generated as base64 data URLs (`data:image/png;base64,...`).
- **Orders** get QR codes generated on creation and retrieval; `GET /orders` (list) does NOT include QR codes.
- **Login/Register** return user data but NOT JWT tokens — JWT generation exists in `JwtService` but is not wired into auth handlers.
