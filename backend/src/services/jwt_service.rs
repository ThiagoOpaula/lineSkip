use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use std::env;

#[derive(Error, Debug)]
pub enum JwtError {
    #[error("Token creation failed: {0}")]
    TokenCreation(String),
    #[error("Token validation failed: {0}")]
    TokenValidation(String),
    #[error("Invalid token")]
    InvalidToken,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32, // user_id
    pub exp: usize, // expiration time
    pub iat: usize, // issued at
}

pub struct JwtService;

impl JwtService {
    /// Generate a JWT token for a user
    pub fn generate_token(user_id: i32) -> Result<String, JwtError> {
        let expiration = chrono::Utc::now()
            .checked_add_signed(chrono::Duration::hours(24))
            .expect("valid timestamp")
            .timestamp() as usize;

        let claims = Claims {
            sub: user_id,
            exp: expiration,
            iat: chrono::Utc::now().timestamp() as usize,
        };

        let secret = env::var("JWT_SECRET")
            .unwrap_or_else(|_| "your-secret-key".to_string());

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )
        .map_err(|e| JwtError::TokenCreation(e.to_string()))
    }

    /// Validate a JWT token and return the claims
    pub fn validate_token(token: &str) -> Result<Claims, JwtError> {
        let secret = env::var("JWT_SECRET")
            .unwrap_or_else(|_| "your-secret-key".to_string());

        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|e| JwtError::TokenValidation(e.to_string()))?;

        Ok(token_data.claims)
    }

    /// Extract user ID from a valid token
    pub fn get_user_id_from_token(token: &str) -> Result<i32, JwtError> {
        let claims = Self::validate_token(token)?;
        Ok(claims.sub)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Set JWT_SECRET for the test run. Tests run in parallel, so we
    /// set it once at the start of each test idempotently.
    fn setup_env() {
        std::env::set_var("JWT_SECRET", "test-secret-key-for-unit-tests");
    }

    #[test]
    fn test_generate_token_success() {
        setup_env();
        let token = JwtService::generate_token(42).expect("should generate token");
        assert!(!token.is_empty(), "token should not be empty");
        assert_eq!(token.matches('.').count(), 2, "JWT should have 3 parts separated by dots");
    }

    #[test]
    fn test_validate_token_returns_correct_claims() {
        setup_env();
        let user_id = 12345;
        let token = JwtService::generate_token(user_id).expect("should generate token");
        let claims = JwtService::validate_token(&token).expect("should validate token");
        assert_eq!(claims.sub, user_id, "sub claim should match user_id");
        assert!(claims.iat > 0, "iat should be set");
        assert!(claims.exp > claims.iat, "exp should be after iat");
    }

    #[test]
    fn test_get_user_id_from_token() {
        setup_env();
        let user_id = 999;
        let token = JwtService::generate_token(user_id).expect("should generate token");
        let extracted = JwtService::get_user_id_from_token(&token).expect("should extract");
        assert_eq!(extracted, user_id);
    }

    #[test]
    fn test_validate_invalid_token_fails() {
        setup_env();
        let result = JwtService::validate_token("invalid.jwt.token");
        assert!(result.is_err(), "invalid token should fail validation");
    }

    #[test]
    fn test_validate_garbage_string_fails() {
        setup_env();
        let result = JwtService::validate_token("this is not a jwt token at all");
        assert!(result.is_err());
    }

    #[test]
    fn test_validate_tampered_token_fails() {
        setup_env();
        let token = JwtService::generate_token(1).expect("should generate");
        let parts: Vec<&str> = token.split('.').collect();
        let tampered = format!("{}.{}.tampered-signature", parts[0], parts[1]);
        let result = JwtService::validate_token(&tampered);
        assert!(result.is_err(), "tampered token should fail validation");
    }

    #[test]
    fn test_get_user_id_from_token_invalid() {
        setup_env();
        let result = JwtService::get_user_id_from_token("bad.token");
        assert!(result.is_err());
    }
}
