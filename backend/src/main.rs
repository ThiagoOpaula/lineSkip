// use axum::{Extension, Router};
// use dotenvy::dotenv;
// use hyper::server::Server;
// use std::net::SocketAddr;

// pub mod db;
// mod handlers;
// mod models;
// mod routes;
// mod services;
// mod utils;

// #[tokio::main]
// async fn main() {
//     dotenv().ok();

//     // connect to the database
//     let pool = db::connection::establish_connection().await;

//     // Set up the router
//     let app = routes::api::create_router().layer(Extension(pool));

//     println!("🚀 Server started successfully");
//     let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
//     axum::serve(listener, app).await.unwrap();
// }

use axum::{response::IntoResponse, Extension, Json, Router};

pub mod db;
mod handlers;
mod routes;

async fn health_checker_handler() -> impl IntoResponse {
    const MESSAGE: &str = "Simple CRUD API with Rust, SQLX, Postgres,and Axum";

    let json_response = serde_json::json!({
        "status": "success",
        "message": MESSAGE
    });

    Json(json_response)
}

#[tokio::main]
async fn main() {
    //let app = Router::new().route("/api/healthchecker", get(health_checker_handler));
    let pool = db::connection::establish_connection().await;
    let app = routes::api::create_router().layer(Extension(pool));

    println!("🚀 Server started successfully");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
