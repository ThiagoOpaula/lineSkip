use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

use crate::services::auth_service::AuthError;

#[derive(Debug)]
pub enum ApiError {
    NotFound(String),
    Conflict(String),
    Internal(String),
    Unauthorized(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            ApiError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
            ApiError::Conflict(msg) => (StatusCode::CONFLICT, msg.clone()),
            ApiError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg.clone()),
            ApiError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg.clone()),
        };

        (status, Json(json!({ "error": message }))).into_response()
    }
}

impl From<AuthError> for ApiError {
    fn from(err: AuthError) -> Self {
        match err {
            AuthError::EmailAlreadyExists => ApiError::Conflict(err.to_string()),
            AuthError::InvalidCredentials => ApiError::Unauthorized(err.to_string()),
            AuthError::Database(_) => ApiError::Internal(err.to_string()),
            AuthError::Hashing(_) => ApiError::Internal(err.to_string()),
        }
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        ApiError::Internal(err.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::StatusCode;

    #[test]
    fn test_not_found_response() {
        let err = ApiError::NotFound("User not found".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[test]
    fn test_conflict_response() {
        let err = ApiError::Conflict("Email exists".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::CONFLICT);
    }

    #[test]
    fn test_internal_response() {
        let err = ApiError::Internal("Server error".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
    }

    #[test]
    fn test_unauthorized_response() {
        let err = ApiError::Unauthorized("Invalid token".to_string());
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[test]
    fn test_from_auth_error_email_exists() {
        let auth_err = AuthError::EmailAlreadyExists;
        let api_err: ApiError = auth_err.into();
        assert!(matches!(api_err, ApiError::Conflict(_)));
    }

    #[test]
    fn test_from_auth_error_invalid_credentials() {
        let auth_err = AuthError::InvalidCredentials;
        let api_err: ApiError = auth_err.into();
        assert!(matches!(api_err, ApiError::Unauthorized(_)));
    }

    #[test]
    fn test_from_sqlx_error() {
        let api_err: ApiError = sqlx::Error::Protocol("test".to_string()).into();
        assert!(matches!(api_err, ApiError::Internal(_)));
    }
}
