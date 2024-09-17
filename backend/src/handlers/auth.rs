// src/handlers/auth.rs
use axum::Json;
use serde_json::json;

pub async fn login() -> Json<serde_json::Value> {
    Json(json!({ "message": "User logged in" }))
}

pub async fn register() -> Json<serde_json::Value> {
    Json(json!({ "message": "User registered" }))
}
