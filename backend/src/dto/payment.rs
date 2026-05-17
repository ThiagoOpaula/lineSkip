use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct PaymentRequest {
    pub amount: f64,
    pub currency: String,
    pub description: String,
    pub payment_method: String,
}

#[derive(Serialize)]
pub struct PaymentResponse {
    pub payment_id: String,
    pub status: String,
    pub amount: f64,
    pub currency: String,
    pub created_at: chrono::NaiveDateTime,
}
