use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde_json::{json, Value};

pub fn success_response(data: Value) -> impl IntoResponse {
    (
        StatusCode::OK,
        axum::Json(json!({
            "status": "success",
            "data": data
        })),
    )
}

pub fn error_response(message: &str) -> impl IntoResponse {
    (
        StatusCode::BAD_REQUEST,
        axum::Json(json!({
            "status": "error",
            "message": message
        })),
    )
}
