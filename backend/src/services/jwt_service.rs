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
