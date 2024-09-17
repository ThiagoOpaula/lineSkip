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
        // Authentication routes
        .route("/auth/login", post(login))
        .route("/auth/register", post(register))
        // Ticket routes
        .route("/tickets", get(get_tickets).post(create_ticket))
        .route(
            "/tickets/:id",
            get(get_ticket).put(update_ticket).delete(delete_ticket),
        )
        // Order routes
        .route("/orders", post(create_order).get(get_orders))
        .route("/orders/:id", get(get_order))
}
