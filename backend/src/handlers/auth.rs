use axum::extract::{Extension, Query};
use axum::Json;
use serde::Deserialize;

use crate::dto::auth::{LoginRequest, RegisterRequest, UserResponse};
use crate::errors::ApiError;
use crate::models::user::User;
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

#[derive(Deserialize)]
pub struct MeQuery {
    pub user_id: i32,
}

pub async fn get_me(
    Extension(state): Extension<AppState>,
    Query(params): Query<MeQuery>,
) -> Result<Json<UserResponse>, ApiError> {
    let user = User::find_by_id(&state.db, params.user_id)
        .await?
        .ok_or_else(|| ApiError::NotFound("User not found".to_string()))?;
    Ok(Json(UserResponse {
        id: user.id,
        username: user.username,
        email: user.email,
    }))
}
