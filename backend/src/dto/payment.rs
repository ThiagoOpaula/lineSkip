use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct PaymentRequest {
    pub amount: f64,
    pub currency: String,
    pub description: String,
    pub payment_method: String,
}

#[derive(Serialize)]
pub struct PaymentResponse {
    pub payment_id: String,
    pub status: String,
    pub amount: f64,
    pub currency: String,
    pub created_at: chrono::NaiveDateTime,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_payment_request_deserialize() {
        let json = r#"{
            "amount": 49.99,
            "currency": "USD",
            "description": "Ticket purchase",
            "payment_method": "credit_card"
        }"#;
        let req: PaymentRequest = serde_json::from_str(json).unwrap();
        assert!((req.amount - 49.99).abs() < f64::EPSILON);
        assert_eq!(req.currency, "USD");
        assert_eq!(req.description, "Ticket purchase");
        assert_eq!(req.payment_method, "credit_card");
    }

    #[test]
    fn test_payment_response_serialize() {
        let resp = PaymentResponse {
            payment_id: "pay_abc123".to_string(),
            status: "completed".to_string(),
            amount: 99.99,
            currency: "BRL".to_string(),
            created_at: chrono::NaiveDateTime::new(
                chrono::NaiveDate::from_ymd_opt(2025, 3, 10).unwrap(),
                chrono::NaiveTime::from_hms_opt(14, 30, 0).unwrap(),
            ),
        };
        let json = serde_json::to_value(resp).unwrap();
        assert_eq!(json["payment_id"], "pay_abc123");
        assert_eq!(json["status"], "completed");
        assert_eq!(json["currency"], "BRL");
    }
}
