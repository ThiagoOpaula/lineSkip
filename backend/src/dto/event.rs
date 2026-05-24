use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreateEventRequest {
    pub name: String,
    pub description: Option<String>,
    pub date: chrono::DateTime<chrono::Utc>,
    pub price: f64,
    pub total_tickets: i32,
}

#[derive(Serialize)]
pub struct EventResponse {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub date: chrono::DateTime<chrono::Utc>,
    pub price: f64,
    pub total_tickets: i32,
    pub created_at: chrono::NaiveDateTime,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_event_request_deserialize() {
        let json = r#"{"name": "Rock Concert", "description": "Live music", "date": "2026-06-15T20:00:00Z", "price": 49.99, "total_tickets": 100}"#;
        let req: CreateEventRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.name, "Rock Concert");
        assert_eq!(req.description, Some("Live music".to_string()));
        assert!((req.price - 49.99).abs() < f64::EPSILON);
        assert_eq!(req.total_tickets, 100);
    }

    #[test]
    fn test_event_response_serialize() {
        use chrono::TimeZone;
        let resp = EventResponse {
            id: 1,
            name: "Festival".to_string(),
            description: None,
            date: chrono::Utc.with_ymd_and_hms(2026, 7, 1, 18, 0, 0).unwrap(),
            price: 99.99,
            total_tickets: 500,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2026, 5, 1).unwrap(),
                chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
            ),
        };
        let json = serde_json::to_value(resp).unwrap();
        assert_eq!(json["id"], 1);
        assert_eq!(json["name"], "Festival");
        assert_eq!(json["total_tickets"], 500);
    }
}
