use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow, Debug)]

pub struct User {
    pub id: i32,
    pub username: String,
    pub password_hash: String,
    pub email: String,
    // pub created_at: chrono::NaiveDateTime,
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
        password: &str,
        email: &str,
    ) -> sqlx::Result<User> {
        sqlx::query_as::<_, User>(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
        )
        .bind(username)
        .bind(password)
        .bind(email)
        .fetch_one(pool)
        .await
    }

    // find user by username
    pub async fn find_by_username(
        pool: &sqlx::PgPool,
        username: &str,
    ) -> sqlx::Result<Option<User>> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1")
            .bind(username)
            .fetch_optional(pool)
            .await
    }

    // find user by email
    pub async fn find_by_email(pool: &sqlx::PgPool, email: &str) -> sqlx::Result<Option<User>> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
            .bind(email)
            .fetch_optional(pool)
            .await
    }
}
