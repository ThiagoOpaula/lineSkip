use axum::extract::{Extension, Path};
use axum::Json;

use crate::dto::event::{CreateEventRequest, EventResponse};
use crate::errors::ApiError;
use crate::models::event::Event;
use crate::state::AppState;

pub async fn get_events(
    Extension(state): Extension<AppState>,
) -> Result<Json<Vec<EventResponse>>, ApiError> {
    let events = Event::find_all(&state.db).await?;
    Ok(Json(events.into_iter().map(event_to_response).collect()))
}

pub async fn get_event(
    Extension(state): Extension<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<EventResponse>, ApiError> {
    let event = Event::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| ApiError::NotFound(format!("Event {id} not found")))?;
    Ok(Json(event_to_response(event)))
}

pub async fn create_event(
    Extension(state): Extension<AppState>,
    Json(data): Json<CreateEventRequest>,
) -> Result<Json<EventResponse>, ApiError> {
    let event = Event::create(
        &state.db,
        &data.name,
        data.description.as_deref(),
        data.date,
        data.price,
        data.total_tickets,
    )
    .await?;
    Ok(Json(event_to_response(event)))
}

fn event_to_response(event: Event) -> EventResponse {
    EventResponse {
        id: event.id,
        name: event.name,
        description: event.description,
        date: event.date,
        price: event.price,
        total_tickets: event.total_tickets,
        created_at: event.created_at,
    }
}
