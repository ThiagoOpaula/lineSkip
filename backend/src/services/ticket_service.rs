use crate::models::ticket::Ticket;
use sqlx::PgPool;

pub struct TicketService;

impl TicketService {
    pub async fn create_ticket(
        pool: &PgPool,
        user_id: i32,
        event_name: &str,
        price: f64,
    ) -> sqlx::Result<Ticket> {
        Ticket::create(pool, user_id, event_name, price).await
    }

    pub async fn get_ticket_by_id(pool: &PgPool, ticket_id: i32) -> sqlx::Result<Option<Ticket>> {
        Ticket::find_by_id(pool, ticket_id).await
    }
}
