use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Event {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub date: chrono::DateTime<chrono::Utc>,
    pub price: f64,
    pub total_tickets: i32,
    pub created_at: chrono::NaiveDateTime,
}

impl Event {
    pub async fn find_all(pool: &sqlx::PgPool) -> sqlx::Result<Vec<Event>> {
        sqlx::query_as::<_, Event>("SELECT * FROM events ORDER BY date ASC")
            .fetch_all(pool)
            .await
    }

    pub async fn find_by_id(pool: &sqlx::PgPool, event_id: i32) -> sqlx::Result<Option<Event>> {
        sqlx::query_as::<_, Event>("SELECT * FROM events WHERE id = $1")
            .bind(event_id)
            .fetch_optional(pool)
            .await
    }

    pub async fn create(
        pool: &sqlx::PgPool,
        name: &str,
        description: Option<&str>,
        date: chrono::DateTime<chrono::Utc>,
        price: f64,
        total_tickets: i32,
    ) -> sqlx::Result<Event> {
        sqlx::query_as::<_, Event>(
            "INSERT INTO events (name, description, date, price, total_tickets) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        )
        .bind(name)
        .bind(description)
        .bind(date)
        .bind(price)
        .bind(total_tickets)
        .fetch_one(pool)
        .await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_event_struct_construction() {
        use chrono::TimeZone;
        let event = Event {
            id: 1,
            name: "Test Event".to_string(),
            description: Some("A great event".to_string()),
            date: chrono::Utc.with_ymd_and_hms(2026, 7, 15, 20, 0, 0).unwrap(),
            price: 29.99,
            total_tickets: 200,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2026, 6, 1).unwrap(),
                chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
            ),
        };
        assert_eq!(event.name, "Test Event");
        assert_eq!(event.description, Some("A great event".to_string()));
        assert!((event.price - 29.99).abs() < f64::EPSILON);
        assert_eq!(event.total_tickets, 200);
    }

    #[test]
    fn test_event_struct_with_no_description() {
        use chrono::TimeZone;
        let event = Event {
            id: 2,
            name: "Minimal Event".to_string(),
            description: None,
            date: chrono::Utc.with_ymd_and_hms(2026, 8, 1, 18, 0, 0).unwrap(),
            price: 0.0,
            total_tickets: 50,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2026, 6, 1).unwrap(),
                chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
            ),
        };
        assert_eq!(event.name, "Minimal Event");
        assert!(event.description.is_none());
        assert!((event.price - 0.0).abs() < f64::EPSILON);
    }

    #[test]
    fn test_event_serde_roundtrip() {
        use chrono::TimeZone;
        let event = Event {
            id: 3,
            name: "Serde Event".to_string(),
            description: None,
            date: chrono::Utc.with_ymd_and_hms(2026, 9, 10, 19, 30, 0).unwrap(),
            price: 49.99,
            total_tickets: 100,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2026, 6, 1).unwrap(),
                chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
            ),
        };
        let json = serde_json::to_value(&event).unwrap();
        assert_eq!(json["name"], "Serde Event");
        assert_eq!(json["price"], 49.99);
        assert_eq!(json["total_tickets"], 100);

        let deserialized: Event = serde_json::from_value(json).unwrap();
        assert_eq!(deserialized.id, event.id);
        assert_eq!(deserialized.name, event.name);
    }
}
