use serde::{Deserialize, Serialize};

use crate::models::order_status::OrderStatus;

#[derive(Deserialize)]
pub struct CreateOrderRequest {
    pub user_id: i32,
    pub ticket_id: Option<i32>,
    pub event_id: Option<i32>,
    pub status: OrderStatus,
}

#[derive(Serialize, Deserialize)]
pub struct OrderResponse {
    pub id: i32,
    pub user_id: i32,
    pub ticket_id: Option<i32>,
    pub event_id: Option<i32>,
    pub status: OrderStatus,
    pub created_at: chrono::NaiveDateTime,
    pub qr_code: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_order_request_deserialize() {
        let json = r#"{"user_id": 1, "ticket_id": 5, "event_id": null, "status": "pending"}"#;
        let req: CreateOrderRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.user_id, 1);
        assert_eq!(req.ticket_id, Some(5));
        assert_eq!(req.event_id, None);
        assert_eq!(req.status, OrderStatus::Pending);
    }

    #[test]
    fn test_create_order_request_with_event_id() {
        let json = r#"{"user_id": 1, "ticket_id": null, "event_id": 3, "status": "pending"}"#;
        let req: CreateOrderRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.user_id, 1);
        assert_eq!(req.ticket_id, None);
        assert_eq!(req.event_id, Some(3));
        assert_eq!(req.status, OrderStatus::Pending);
    }

    #[test]
    fn test_order_response_serialize() {
        let resp = OrderResponse {
            id: 1,
            user_id: 1,
            ticket_id: Some(5),
            event_id: None,
            status: OrderStatus::Completed,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2025, 1, 1).unwrap(),
                chrono::NaiveTime::from_hms_opt(12, 0, 0).unwrap(),
            ),
            qr_code: Some("data:image/png;base64,abc123".to_string()),
        };
        let json = serde_json::to_value(resp).unwrap();
        assert_eq!(json["id"], 1);
        assert_eq!(json["status"], "completed");
        assert_eq!(json["qr_code"], "data:image/png;base64,abc123");
    }

    #[test]
    fn test_order_response_serialize_no_qr() {
        let resp = OrderResponse {
            id: 2,
            user_id: 3,
            ticket_id: Some(10),
            event_id: None,
            status: OrderStatus::Pending,
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2025, 6, 15).unwrap(),
                chrono::NaiveTime::from_hms_opt(10, 30, 0).unwrap(),
            ),
            qr_code: None,
        };
        let json = serde_json::to_value(resp).unwrap();
        assert_eq!(json["qr_code"], serde_json::Value::Null);
    }

    #[test]
    fn test_order_response_deserialize() {
        let json = r#"{
            "id": 1,
            "user_id": 1,
            "ticket_id": 5,
            "event_id": null,
            "status": "completed",
            "created_at": "2025-01-01T12:00:00",
            "qr_code": null
        }"#;
        let resp: OrderResponse = serde_json::from_str(json).unwrap();
        assert_eq!(resp.id, 1);
        assert_eq!(resp.ticket_id, Some(5));
        assert!(resp.event_id.is_none());
        assert_eq!(resp.status, OrderStatus::Completed);
        assert!(resp.qr_code.is_none());
    }
}
