use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Order {
    pub id: i32,
    pub user_id: i32,
    pub ticket_id: i32,
    pub status: String,
    pub created_at: chrono::NaiveDateTime,
}

impl Order {
    // Fetch an order by ID
    pub async fn find_by_id(pool: &sqlx::PgPool, order_id: i32) -> sqlx::Result<Option<Order>> {
        sqlx::query_as::<_, Order>("SELECT * FROM orders WHERE id = $1")
            .bind(order_id)
            .fetch_optional(pool)
            .await
    }

    // Insert a new order into the database
    pub async fn create(
        pool: &sqlx::PgPool,
        user_id: i32,
        ticket_id: i32,
        status: &str,
    ) -> sqlx::Result<Order> {
        sqlx::query_as::<_, Order>(
            "INSERT INTO orders (user_id, ticket_id, status) VALUES ($1, $2, $3) RETURNING *",
        )
        .bind(user_id)
        .bind(ticket_id)
        .bind(status)
        .fetch_one(pool)
        .await
    }
}
