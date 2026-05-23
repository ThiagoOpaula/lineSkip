use axum::extract::{Extension, Path};
use axum::Json;

use crate::dto::order::{CreateOrderRequest, OrderResponse};
use crate::errors::ApiError;
use crate::models::order::Order;
use crate::services::qr_service::QrService;
use crate::state::AppState;

pub async fn create_order(
    Extension(state): Extension<AppState>,
    Json(data): Json<CreateOrderRequest>,
) -> Result<Json<OrderResponse>, ApiError> {
    let order =
        Order::create(&state.db, data.user_id, data.ticket_id, &data.status).await?;

    // Generate QR code for the order
    let qr_code = QrService::generate_order_qr(order.id, order.user_id)
        .map_err(|e| ApiError::Internal(format!("Failed to generate QR code: {}", e)))?;

    // Cache the order with QR code
    let order_data = serde_json::json!({
        "id": order.id,
        "user_id": order.user_id,
        "ticket_id": order.ticket_id,
        "status": order.status,
        "created_at": order.created_at,
        "qr_code": qr_code,
    });

    if let Err(e) = state.cache.cache_order(order.id, &order_data).await {
        log::warn!("Failed to cache order {}: {}", order.id, e);
    }

    Ok(Json(order_to_response(order, Some(qr_code))))
}

pub async fn get_orders(
    Extension(state): Extension<AppState>,
) -> Result<Json<Vec<OrderResponse>>, ApiError> {
    let orders = Order::find_all(&state.db).await?;
    Ok(Json(orders.into_iter().map(|o| order_to_response(o, None)).collect()))
}

pub async fn get_order(
    Extension(state): Extension<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<OrderResponse>, ApiError> {
    // Try to get from cache first
    if let Ok(Some(cached)) = state.cache.get_cached_order(id).await {
        let order_response: OrderResponse = serde_json::from_value(cached)
            .map_err(|e| ApiError::Internal(format!("Failed to parse cached order: {}", e)))?;
        return Ok(Json(order_response));
    }

    let order = Order::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Order {id} not found")))?;

    // Generate QR code for the order
    let qr_code = QrService::generate_order_qr(order.id, order.user_id)
        .map_err(|e| ApiError::Internal(format!("Failed to generate QR code: {}", e)))?;

    Ok(Json(order_to_response(order, Some(qr_code))))
}

fn order_to_response(order: Order, qr_code: Option<String>) -> OrderResponse {
    OrderResponse {
        id: order.id,
        user_id: order.user_id,
        ticket_id: order.ticket_id,
        status: order.status,
        created_at: order.created_at,
        qr_code,
    }
}
