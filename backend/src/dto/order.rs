use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreateOrderRequest {
    pub user_id: i32,
    pub ticket_id: i32,
    pub status: String,
}

#[derive(Serialize)]
pub struct OrderResponse {
    pub id: i32,
    pub user_id: i32,
    pub ticket_id: i32,
    pub status: String,
    pub created_at: chrono::NaiveDateTime,
}
