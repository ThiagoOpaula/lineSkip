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
        Err(AuthError::Database(sqlx::Error::RowNotFound))
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
