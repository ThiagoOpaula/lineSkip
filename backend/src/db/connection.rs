use dotenvy::dotenv;
use sqlx::{PgPool, Pool, Postgres};
use std::env;

pub async fn establish_connection() -> Pool<Postgres> {
    let _ = dotenv();

    // Fetch the database URL from environment variables
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env or environment variables");

    // Create a connection pool
    PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to the database")
}
