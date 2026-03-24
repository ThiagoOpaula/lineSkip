use axum::Extension;

mod db;
mod dto;
mod errors;
mod handlers;
mod models;
mod routes;
mod services;
mod state;
mod utils;

#[tokio::main]
async fn main() {
    let pool = db::connection::establish_connection().await;
    let app_state = state::AppState::new(pool);
    let app = routes::api::create_router().layer(Extension(app_state));

    println!("Server started successfully");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
