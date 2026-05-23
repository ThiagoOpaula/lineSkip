use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PaymentError {
    #[error("Payment failed: {0}")]
    Failed(String),
    #[error("Invalid payment amount")]
    InvalidAmount,
    #[error("Payment already processed")]
    AlreadyProcessed,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentData {
    pub amount: f64,
    pub currency: String,
    pub description: String,
    pub payment_method: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentResponse {
    pub payment_id: String,
    pub status: String,
    pub amount: f64,
    pub currency: String,
    pub created_at: chrono::NaiveDateTime,
}

pub struct PaymentService;

impl PaymentService {
    /// Process a payment request (mock implementation for demonstration)
    pub async fn process_payment(
        payment_data: PaymentData,
    ) -> Result<PaymentResponse, PaymentError> {
        // Validate amount
        if payment_data.amount <= 0.0 {
            return Err(PaymentError::InvalidAmount);
        }

        // Generate a mock payment ID
        let payment_id = format!("pay_{}", uuid::Uuid::new_v4());

        // Simulate payment processing
        // In a real implementation, this would call a payment gateway like Stripe
        let payment_response = PaymentResponse {
            payment_id,
            status: "completed".to_string(),
            amount: payment_data.amount,
            currency: payment_data.currency,
            created_at: chrono::Utc::now().naive_utc(),
        };

        Ok(payment_response)
    }

    /// Validate payment details
    pub fn validate_payment(payment_data: &PaymentData) -> Result<(), PaymentError> {
        if payment_data.amount <= 0.0 {
            return Err(PaymentError::InvalidAmount);
        }

        if payment_data.currency.is_empty() {
            return Err(PaymentError::Failed("Currency is required".to_string()));
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_payment_data() -> PaymentData {
        PaymentData {
            amount: 100.0,
            currency: "USD".to_string(),
            description: "Test payment".to_string(),
            payment_method: "credit_card".to_string(),
        }
    }

    #[test]
    fn test_validate_payment_valid() {
        let data = valid_payment_data();
        assert!(PaymentService::validate_payment(&data).is_ok());
    }

    #[test]
    fn test_validate_payment_zero_amount() {
        let data = PaymentData {
            amount: 0.0,
            ..valid_payment_data()
        };
        let err = PaymentService::validate_payment(&data).unwrap_err();
        assert!(matches!(err, PaymentError::InvalidAmount));
    }

    #[test]
    fn test_validate_payment_negative_amount() {
        let data = PaymentData {
            amount: -50.0,
            ..valid_payment_data()
        };
        let err = PaymentService::validate_payment(&data).unwrap_err();
        assert!(matches!(err, PaymentError::InvalidAmount));
    }

    #[test]
    fn test_validate_payment_empty_currency() {
        let data = PaymentData {
            currency: String::new(),
            ..valid_payment_data()
        };
        let err = PaymentService::validate_payment(&data).unwrap_err();
        assert!(matches!(err, PaymentError::Failed(_)));
    }

    #[tokio::test]
    async fn test_process_payment_valid() {
        let data = valid_payment_data();
        let result = PaymentService::process_payment(data).await;
        assert!(result.is_ok());

        let response = result.unwrap();
        assert!(response.payment_id.starts_with("pay_"));
        assert_eq!(response.status, "completed");
        assert_eq!(response.amount, 100.0);
        assert_eq!(response.currency, "USD");
    }

    #[tokio::test]
    async fn test_process_payment_invalid_amount() {
        let data = PaymentData {
            amount: 0.0,
            ..valid_payment_data()
        };
        let err = PaymentService::process_payment(data).await.unwrap_err();
        assert!(matches!(err, PaymentError::InvalidAmount));
    }

    #[test]
    fn test_payment_error_display() {
        assert_eq!(
            PaymentError::InvalidAmount.to_string(),
            "Invalid payment amount"
        );
        assert_eq!(
            PaymentError::Failed("timeout".to_string()).to_string(),
            "Payment failed: timeout"
        );
        assert_eq!(
            PaymentError::AlreadyProcessed.to_string(),
            "Payment already processed"
        );
    }
}
