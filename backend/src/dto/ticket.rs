use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreateTicketRequest {
    pub user_id: i32,
    pub event_name: String,
    pub price: f64,
}

#[derive(Deserialize)]
pub struct UpdateTicketRequest {
    pub event_name: Option<String>,
    pub price: Option<f64>,
}

#[derive(Serialize)]
pub struct TicketResponse {
    pub id: i32,
    pub user_id: i32,
    pub event_name: String,
    pub price: f64,
    pub created_at: chrono::NaiveDateTime,
}
