use axum::Extension;

pub mod db;
mod handlers;
mod models;
mod routes;
mod services;
mod utils;

#[tokio::main]
async fn main() {
    let pool = db::connection::establish_connection().await;
    let app = routes::api::create_router().layer(Extension(pool));

    println!("🚀 Server started successfully");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
