use crate::models::user::User;
use crate::utils::hash::{hash_password, verify_password};
use sqlx::PgPool;

pub struct AuthService;

impl AuthService {
    pub async fn register_user(
        pool: &PgPool,
        username: &str,
        password: &str,
        email: &str,
    ) -> sqlx::Result<User> {
        let password_hash = hash_password(password)?;
        User::create(pool, username, &password_hash, email).await
    }

    pub async fn verify_user(
        pool: &PgPool,
        user_id: i32,
        password: &str,
    ) -> sqlx::Result<Option<User>> {
        if let Some(user) = User::find_by_id(pool, user_id).await? {
            if verify_password(&user.password_hash, password)? {
                return Ok(Some(user));
            }
        }
        Ok(None)
    }
}
