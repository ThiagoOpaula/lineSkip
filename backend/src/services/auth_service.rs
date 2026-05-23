use crate::models::user::User;
use crate::utils::hash::{hash_password, verify_password};
use sqlx::PgPool;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum AuthError {
    #[error("Database error")]
    Database(#[from] sqlx::Error),
    #[error("Hashing error")]
    Hashing(#[from] argon2::Error),
    #[error("Email already exists")]
    EmailAlreadyExists,
    #[error("Invalid username or password")]
    InvalidCredentials,
}

pub struct AuthService;

impl AuthService {
    pub async fn register_user(
        pool: &PgPool,
        username: &str,
        password: &str,
        email: &str,
    ) -> Result<User, AuthError> {
        // Check if the email already exists in the database
        let repeated_email = User::find_by_email(pool, email).await?.is_some();
        if repeated_email {
            return Err(AuthError::EmailAlreadyExists);
        }
        // Use the custom AuthError type
        let password_hash = hash_password(password)?; // `?` now works with `AuthError`
        let user = User::create(pool, username, &password_hash, email)
            .await
            .map_err(AuthError::from);
        user
    }

    pub async fn login_user(
        pool: &PgPool,
        username: &str,
        password: &str,
    ) -> Result<User, AuthError> {
        if let Some(user) = User::find_by_username(pool, username).await? {
            if verify_password(&user.password_hash, password)? {
                return Ok(user);
            }
        }
        Err(AuthError::InvalidCredentials)
    }

    pub async fn verify_user(
        pool: &PgPool,
        user_id: i32,
        password: &str,
    ) -> Result<Option<User>, AuthError> {
        if let Some(user) = User::find_by_id(pool, user_id).await? {
            if verify_password(&user.password_hash, password)? {
                return Ok(Some(user));
            }
        }
        Ok(None)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_auth_error_display() {
        assert_eq!(
            AuthError::Database(sqlx::Error::Protocol("conn lost".to_string())).to_string(),
            "Database error"
        );
        assert_eq!(
            AuthError::EmailAlreadyExists.to_string(),
            "Email already exists"
        );
        assert_eq!(
            AuthError::InvalidCredentials.to_string(),
            "Invalid username or password"
        );
    }

    #[test]
    fn test_auth_error_from_sqlx() {
        let err: AuthError = sqlx::Error::Protocol("test".to_string()).into();
        assert!(matches!(err, AuthError::Database(_)));
    }

    #[tokio::test]
    #[ignore]
    async fn test_register_user_with_existing_email() {
        // Integration test — requires a running Postgres
        // Set up: DATABASE_URL must point to a test DB
        let database_url = std::env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set for this test");
        let pool = sqlx::PgPool::connect(&database_url)
            .await
            .expect("connect to DB");

        // First registration should succeed
        let username = format!("test_user_{}", uuid::Uuid::new_v4());
        let email = format!("{}@test.com", username);
        let _ = AuthService::register_user(&pool, &username, "password123", &email).await;

        // Second registration with same email should fail
        let duplicate = AuthService::register_user(&pool, "other_user", "password123", &email).await;
        assert!(matches!(duplicate, Err(AuthError::EmailAlreadyExists)));
    }

    #[tokio::test]
    #[ignore]
    async fn test_login_user_invalid_credentials() {
        let database_url = std::env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set for this test");
        let pool = sqlx::PgPool::connect(&database_url)
            .await
            .expect("connect to DB");

        let result = AuthService::login_user(&pool, "nonexistent_user", "password").await;
        assert!(matches!(result, Err(AuthError::InvalidCredentials)));
    }
}
