// src/handlers/orders.rs
use axum::Json;
use serde_json::json;

pub async fn create_order() -> Json<serde_json::Value> {
    Json(json!({ "message": "Order created" }))
}

pub async fn get_orders() -> Json<serde_json::Value> {
    Json(json!({ "orders": [] }))
}

pub async fn get_order() -> Json<serde_json::Value> {
    Json(json!({ "order": {} }))
}
