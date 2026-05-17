use axum::extract::Extension;
use axum::Json;

use crate::dto::payment::{PaymentRequest, PaymentResponse};
use crate::errors::ApiError;
use crate::services::payment_service::{PaymentService, PaymentError, PaymentData};
use crate::state::AppState;

pub async fn process_payment(
    Extension(_state): Extension<AppState>,
    Json(data): Json<PaymentRequest>,
) -> Result<Json<PaymentResponse>, ApiError> {
    // Convert DTO to service data
    let payment_data = PaymentData {
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        payment_method: data.payment_method,
    };

    // Validate payment details
    PaymentService::validate_payment(&payment_data).map_err(|e| match e {
        PaymentError::InvalidAmount => ApiError::Conflict("Invalid payment amount".to_string()),
        PaymentError::Failed(msg) => ApiError::Internal(msg),
        PaymentError::AlreadyProcessed => ApiError::Conflict("Payment already processed".to_string()),
    })?;

    // Process payment
    let payment_response = PaymentService::process_payment(payment_data).await.map_err(|e| match e {
        PaymentError::Failed(msg) => ApiError::Internal(msg),
        PaymentError::InvalidAmount => ApiError::Conflict("Invalid payment amount".to_string()),
        PaymentError::AlreadyProcessed => ApiError::Conflict("Payment already processed".to_string()),
    })?;

    Ok(Json(PaymentResponse {
        payment_id: payment_response.payment_id,
        status: payment_response.status,
        amount: payment_response.amount,
        currency: payment_response.currency,
        created_at: payment_response.created_at,
    }))
}
