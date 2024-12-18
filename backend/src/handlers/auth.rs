// src/handlers/auth.rs
use axum::extract::Extension;
use axum::Json;
use serde_json::json;
use sqlx::PgPool;

use crate::services::auth_service::{self, AuthService};

pub async fn login(
    Extension(pool): Extension<PgPool>,
    Json(data): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    let username = data["username"].as_str().unwrap();
    let password = data["password"].as_str().unwrap();
    let _ = AuthService::login_user(&pool, username, password).await;

    return Json(json!({ "message": "User logged in" }));
}

pub async fn register(
    Extension(pool): Extension<PgPool>,
    Json(data): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    let username = data["username"].as_str().unwrap();
    let password = data["password"].as_str().unwrap();
    let email = data["email"].as_str().unwrap();

    let auth_service = AuthService::register_user(&pool, username, password, email).await;
    match auth_service {
        Ok(_) => Json(json!({ "message": "User registered" })),
        Err(err) => Json(json!({ "message": err.to_string() })),
    }
}
