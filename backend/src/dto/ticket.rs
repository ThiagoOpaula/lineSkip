use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreateTicketRequest {
    pub user_id: i32,
    pub event_name: String,
    pub price: f64,
}

#[derive(Deserialize)]
pub struct UpdateTicketRequest {
    pub event_name: Option<String>,
    pub price: Option<f64>,
}

#[derive(Serialize)]
pub struct TicketResponse {
    pub id: i32,
    pub user_id: i32,
    pub event_name: String,
    pub price: f64,
    pub created_at: chrono::NaiveDateTime,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_ticket_request_deserialize() {
        let json = r#"{"user_id": 1, "event_name": "Concert", "price": 99.99}"#;
        let req: CreateTicketRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.user_id, 1);
        assert_eq!(req.event_name, "Concert");
        assert!((req.price - 99.99).abs() < f64::EPSILON);
    }

    #[test]
    fn test_update_ticket_request_all_fields() {
        let json = r#"{"event_name": "Updated Event", "price": 49.99}"#;
        let req: UpdateTicketRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.event_name, Some("Updated Event".to_string()));
        assert!((req.price.unwrap() - 49.99).abs() < f64::EPSILON);
    }

    #[test]
    fn test_update_ticket_request_partial() {
        let json = r#"{"event_name": "Only Name Change"}"#;
        let req: UpdateTicketRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.event_name, Some("Only Name Change".to_string()));
        assert!(req.price.is_none());
    }

    #[test]
    fn test_ticket_response_serialize() {
        let resp = TicketResponse {
            id: 10,
            user_id: 3,
            event_name: "Festival".to_string(),
            price: 150.0,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2025, 1, 1).unwrap(),
                chrono::NaiveTime::from_hms_opt(12, 0, 0).unwrap(),
            ),
        };
        let json = serde_json::to_value(resp).unwrap();
        assert_eq!(json["id"], 10);
        assert_eq!(json["event_name"], "Festival");
        assert!((json["price"].as_f64().unwrap() - 150.0).abs() < f64::EPSILON);
    }
}
