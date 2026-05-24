use axum::{
    routing::{get, post},
    Router,
};

use crate::handlers::{
    auth::{get_me, login, register},
    events::{create_event, get_event, get_events},
    orders::{create_order, get_order, get_orders},
    payment::process_payment,
    tickets::{create_ticket, delete_ticket, get_ticket, get_tickets, update_ticket},
};

pub fn create_router() -> Router {
    Router::new().nest("/api", api_routes())
}

fn api_routes() -> Router {
    Router::new()
        .nest("/auth", auth_routes())
        .nest("/events", event_routes())
        .nest("/tickets", ticket_routes())
        .nest("/orders", order_routes())
        .nest("/payment", payment_routes())
}

fn auth_routes() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/me", get(get_me))
}

fn event_routes() -> Router {
    Router::new()
        .route("/", get(get_events).post(create_event))
        .route("/:id", get(get_event))
}

fn ticket_routes() -> Router {
    Router::new()
        .route("/", get(get_tickets).post(create_ticket))
        .route("/:id", get(get_ticket).put(update_ticket).delete(delete_ticket))
}

fn order_routes() -> Router {
    Router::new()
        .route("/", post(create_order).get(get_orders))
        .route("/:id", get(get_order))
}

fn payment_routes() -> Router {
    Router::new()
        .route("/process", post(process_payment))
}
