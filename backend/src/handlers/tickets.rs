// src/handlers/tickets.rs
use axum::Json;
use serde_json::json;

pub async fn create_ticket() -> Json<serde_json::Value> {
    Json(json!({ "message": "Ticket created" }))
}

pub async fn get_tickets() -> Json<serde_json::Value> {
    Json(json!({ "tickets": [] }))
}

pub async fn get_ticket() -> Json<serde_json::Value> {
    Json(json!({ "ticket": {} }))
}

pub async fn update_ticket() -> Json<serde_json::Value> {
    Json(json!({ "message": "Ticket updated" }))
}

pub async fn delete_ticket() -> Json<serde_json::Value> {
    Json(json!({ "message": "Ticket deleted" }))
}
