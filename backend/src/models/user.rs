use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password_hash: String,
    pub email: String,
    pub created_at: chrono::NaiveDateTime,
}

impl User {
    // Fetch a user by ID
    pub async fn find_by_id(pool: &sqlx::PgPool, user_id: i32) -> sqlx::Result<Option<User>> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_optional(pool)
            .await
    }

    // Insert a new user into the database
    pub async fn create(
        pool: &sqlx::PgPool,
        username: &str,
        password_hash: &str,
        email: &str,
    ) -> sqlx::Result<User> {
        sqlx::query_as::<_, User>(
            "INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *",
        )
        .bind(username)
        .bind(password_hash)
        .bind(email)
        .fetch_one(pool)
        .await
    }
}
