use axum::extract::{Extension, Path};
use axum::Json;

use crate::dto::ticket::{CreateTicketRequest, TicketResponse, UpdateTicketRequest};
use crate::errors::ApiError;
use crate::models::ticket::Ticket;
use crate::state::AppState;

pub async fn create_ticket(
    Extension(state): Extension<AppState>,
    Json(data): Json<CreateTicketRequest>,
) -> Result<Json<TicketResponse>, ApiError> {
    let ticket =
        Ticket::create(&state.db, data.user_id, &data.event_name, data.price).await?;
    Ok(Json(ticket_to_response(ticket)))
}

pub async fn get_tickets(
    Extension(state): Extension<AppState>,
) -> Result<Json<Vec<TicketResponse>>, ApiError> {
    let tickets = Ticket::find_all(&state.db).await?;
    Ok(Json(tickets.into_iter().map(ticket_to_response).collect()))
}

pub async fn get_ticket(
    Extension(state): Extension<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<TicketResponse>, ApiError> {
    let ticket = Ticket::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Ticket {id} not found")))?;
    Ok(Json(ticket_to_response(ticket)))
}

pub async fn update_ticket(
    Extension(state): Extension<AppState>,
    Path(id): Path<i32>,
    Json(data): Json<UpdateTicketRequest>,
) -> Result<Json<TicketResponse>, ApiError> {
    let existing = Ticket::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Ticket {id} not found")))?;

    let event_name = data.event_name.unwrap_or(existing.event_name);
    let price = data.price.unwrap_or(existing.price);

    let ticket = Ticket::update(&state.db, id, &event_name, price)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Ticket {id} not found")))?;
    Ok(Json(ticket_to_response(ticket)))
}

pub async fn delete_ticket(
    Extension(state): Extension<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let rows = Ticket::delete(&state.db, id).await?;
    if rows == 0 {
        return Err(ApiError::NotFound(format!("Ticket {id} not found")));
    }
    Ok(Json(serde_json::json!({ "message": "Ticket deleted" })))
}

fn ticket_to_response(ticket: Ticket) -> TicketResponse {
    TicketResponse {
        id: ticket.id,
        user_id: ticket.user_id,
        event_name: ticket.event_name,
        price: ticket.price,
        created_at: ticket.created_at,
    }
}
