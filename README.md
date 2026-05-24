# lineSkip

"Lineskip" is a web application that allows users to purchase food tickets online and skip the ticket line. Built with Next.js for the frontend and Rust with Axum for the backend, this app streamlines the food ordering process by letting users go directly to the food line after purchasing a ticket. Efficient, fast, and convenient!

## AI Development

This project was developed using **Claude with Xiaomi Mimo-v2 models** for code generation and assistance.

# Project Overview

This is a full-stack web application built using Next.js for the frontend and Rust with Axum for the backend. The project appears to be a ticketing system, allowing users to create and manage tickets, as well as place orders.

## Getting Started

### Frontend

1. Clone the repository and navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Start the development server with `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

```mermaid
flowchart LR
    User[User] --> UI[Next.js UI Components]

    subgraph Frontend
        UI --> State[State Management<br/>Zustand]

        UI --> Pages[Next.js Pages<br/>Home / Auth / Dashboard<br/>Tickets / Orders]

        Pages --> API[API Integration Layer<br/>api.ts]

        Components[Reusable Components<br/>AuthForm / TicketList<br/>OrderList / PaymentForm]
        UI --> Components

        API --> Backend[Backend API /api]
    end
```

### Backend

1. Clone the repository and navigate to the `backend` directory.
2. Run `cargo build` to build the Rust application.
3. Start the backend server with `cargo run`.
4. The backend API will be available at [http://localhost:8000/api](http://localhost:8000/api).


```mermaid
flowchart LR
    Client[Client / Frontend] --> API[Axum API]

    subgraph Backend
        API --> Auth[User Authentication<br/>JWT]
        API --> Ticket[Ticket Management<br/>CRUD]
        API --> Order[Order Processing]
        API --> Payment[Payment Handling]
        API --> QR[QR Code / Confirmation Generation]

        API --> ORM[SQLx]
        ORM --> DB[(PostgreSQL)]

        API --> Cache[(Redis Cache)]

        Security[HTTPS + JWT Security]
        Security --> API
    end
```

## Bruno API

The Bruno API is a collection of APIs used in the Lineskip application. It is defined in the backend/lineskip-api-collection/bruno.json file.

### API Endpoints
#### The Bruno API includes the following endpoints:

Tickets: Create, read, update, and delete tickets

Orders: Create, read, update, and delete orders

Users: Create, read, update, and delete users 

###  API Documentation 

For more information about the Bruno API, including API documentation and usage examples, please see the [API documentation](https://docs.usebruno.com/introduction/what-is-bruno).

## Database Setup with sqlx-cli

To interact with the PostgreSQL database, we use sqlx-cli. This tool allows us to easily manage our database schema and perform migrations.

### Installing sqlx-cli

To install sqlx-cli, run the following command:
```bash
cargo install sqlx-cli
```
### Configuring the Database

Create a new file named `.env` in the root of the project with the following contents:
```makefile
DATABASE_URL=postgres://lineskip_user:secretpassword@localhost:5432/lineskip_db
```
Replace the placeholders with your actual database credentials.

### Running Migrations

To apply the database schema, run the following command:
```bash
sqlx migrate run
```
This will create the necessary tables and indexes in your database.

## Docker Setup

To simplify the development process, we use Docker to containerize our application. This allows us to easily manage dependencies and ensure consistency across different environments.

### Building the Docker Images

To build the Docker images, run the following command:
```bash
docker-compose build
```
This will create the necessary images for the frontend, backend, and database containers.

### Starting the Containers

To start the containers, run the following command:
```bash
docker-compose up
```
This will start the frontend, backend, and database containers, and make the application available at [http://localhost:3000](http://localhost:3000).

## Features

* **User Authentication**: Secure login and registration with JWT tokens
* **Ticket Management**: Create, view, and manage event tickets
* **Order Processing**: Purchase tickets and generate QR codes for easy verification
* **Payment Integration**: Process payments securely (mock implementation)
* **QR Code Generation**: Generate QR codes for order confirmation
* **Caching Layer**: Redis caching for improved performance
* **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Architecture

### Backend (Rust + Axum)
- **Authentication**: JWT-based authentication with password hashing
- **Database**: PostgreSQL with SQLx ORM
- **Caching**: Redis for performance optimization
- **Payment**: Payment processing service (mock implementation)
- **QR Code**: QR code generation for order verification

### Frontend (Next.js + TypeScript)
- **State Management**: Zustand for client-side state
- **API Integration**: RESTful API calls to backend
- **UI Components**: Reusable React components with Tailwind CSS
- **QR Code Display**: QR code rendering for order confirmation

## Dependencies

* Next.js 14
* Rust 1.80+
* Axum 0.7
* PostgreSQL
* Redis
* SQLx
* Docker (for containerization)

## Contributing

Contributions are welcome! Please submit a pull request with your changes, and I'll review them as soon as possible.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more information.
