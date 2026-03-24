use axum::{
    routing::{get, post},
    Router,
};

use crate::handlers::{
    auth::{login, register},
    orders::{create_order, get_order, get_orders},
    tickets::{create_ticket, delete_ticket, get_ticket, get_tickets, update_ticket},
};

pub fn create_router() -> Router {
    Router::new()
        .nest("/auth", auth_routes())
        .nest("/tickets", ticket_routes())
        .nest("/orders", order_routes())
}

fn auth_routes() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
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
