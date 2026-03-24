use axum::extract::{Extension, Path};
use axum::Json;

use crate::dto::order::{CreateOrderRequest, OrderResponse};
use crate::errors::ApiError;
use crate::models::order::Order;
use crate::state::AppState;

pub async fn create_order(
    Extension(state): Extension<AppState>,
    Json(data): Json<CreateOrderRequest>,
) -> Result<Json<OrderResponse>, ApiError> {
    let order =
        Order::create(&state.db, data.user_id, data.ticket_id, &data.status).await?;
    Ok(Json(order_to_response(order)))
}

pub async fn get_orders(
    Extension(state): Extension<AppState>,
) -> Result<Json<Vec<OrderResponse>>, ApiError> {
    let orders = Order::find_all(&state.db).await?;
    Ok(Json(orders.into_iter().map(order_to_response).collect()))
}

pub async fn get_order(
    Extension(state): Extension<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<OrderResponse>, ApiError> {
    let order = Order::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Order {id} not found")))?;
    Ok(Json(order_to_response(order)))
}

fn order_to_response(order: Order) -> OrderResponse {
    OrderResponse {
        id: order.id,
        user_id: order.user_id,
        ticket_id: order.ticket_id,
        status: order.status,
        created_at: order.created_at,
    }
}
