use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Ticket {
    pub id: i32,
    pub user_id: i32,
    pub event_name: String,
    pub price: f64,
    pub created_at: chrono::NaiveDateTime,
}

impl Ticket {
    // Fetch a ticket by ID
    pub async fn find_by_id(pool: &sqlx::PgPool, ticket_id: i32) -> sqlx::Result<Option<Ticket>> {
        sqlx::query_as::<_, Ticket>("SELECT * FROM tickets WHERE id = $1")
            .bind(ticket_id)
            .fetch_optional(pool)
            .await
    }

    // Insert a new ticket into the database
    pub async fn create(
        pool: &sqlx::PgPool,
        user_id: i32,
        event_name: &str,
        price: f64,
    ) -> sqlx::Result<Ticket> {
        sqlx::query_as::<_, Ticket>(
            "INSERT INTO tickets (user_id, event_name, price) VALUES ($1, $2, $3) RETURNING *",
        )
        .bind(user_id)
        .bind(event_name)
        .bind(price)
        .fetch_one(pool)
        .await
    }
}
