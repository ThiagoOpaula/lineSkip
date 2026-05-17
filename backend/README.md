# LineSkip Backend

This is the backend API for the LineSkip application, built with Rust and Axum.

## AI Development

This project was developed using **Claude with Xiaomi Mimo-v2 models** for code generation and assistance.

## Project Structure

```
backend/
├── src/
│   ├── db/           # Database connection
│   ├── dto/          # Data Transfer Objects
│   ├── errors/       # Error handling
│   ├── handlers/     # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic services
│   ├── state/        # Application state
│   └── utils/        # Utility functions
├── migrations/       # Database migrations
└── Cargo.toml        # Dependencies
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Tickets
- `GET /tickets` - Get all tickets
- `GET /tickets/:id` - Get ticket by ID
- `POST /tickets` - Create a new ticket
- `PUT /tickets/:id` - Update a ticket
- `DELETE /tickets/:id` - Delete a ticket

### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID (includes QR code)
- `POST /orders` - Create a new order (generates QR code)

### Payment
- `POST /payment/process` - Process a payment

## Getting Started

### Prerequisites
- Rust 1.80+
- PostgreSQL database
- sqlx-cli

### Setup

1. Install sqlx-cli:
```bash
cargo install sqlx-cli
```

2. Create a `.env` file in the backend directory:
```makefile
DATABASE_URL=postgres://lineskip_user:secretpassword@localhost:5432/lineskip_db
```

3. Run migrations:
```bash
sqlx migrate run
```

4. Build and run:
```bash
cargo build
cargo run
```

The API will be available at `http://localhost:8000/api`

## Docker Setup

Build and run with Docker:
```bash
docker-compose up --build
```

## Dependencies

- axum - Web framework
- sqlx - PostgreSQL database access
- tokio - Async runtime
- serde - Serialization
- rust-argon2 - Password hashing
- redis - Caching layer
- qrcode - QR code generation
- jsonwebtoken - JWT authentication
- tracing - Logging
