use axum::extract::Extension;
use axum::Json;

use crate::dto::auth::{LoginRequest, RegisterRequest, UserResponse};
use crate::errors::ApiError;
use crate::services::auth_service::AuthService;
use crate::state::AppState;

pub async fn login(
    Extension(state): Extension<AppState>,
    Json(data): Json<LoginRequest>,
) -> Result<Json<UserResponse>, ApiError> {
    let user = AuthService::login_user(&state.db, &data.username, &data.password).await?;
    Ok(Json(UserResponse {
        id: user.id,
        username: user.username,
        email: user.email,
    }))
}

pub async fn register(
    Extension(state): Extension<AppState>,
    Json(data): Json<RegisterRequest>,
) -> Result<Json<UserResponse>, ApiError> {
    let user =
        AuthService::register_user(&state.db, &data.username, &data.password, &data.email)
            .await?;
    Ok(Json(UserResponse {
        id: user.id,
        username: user.username,
        email: user.email,
    }))
}
