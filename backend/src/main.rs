use axum::http::HeaderValue;
use axum::Extension;
use lineskip_backend::{db, routes, state};
use std::env;
use tower_http::cors::CorsLayer;
use tower_http::trace::{self, TraceLayer};
use tracing::Level;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "lineskip_backend=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let pool = db::connection::establish_connection().await;
    sqlx::migrate!().run(&pool).await.expect("Failed to run database migrations");
    let app_state = state::AppState::new(pool).await;
    let cors = if let Ok(frontend_url) = env::var("FRONTEND_URL") {
        CorsLayer::new()
            .allow_origin(HeaderValue::from_str(&frontend_url).unwrap())
            .allow_methods(tower_http::cors::Any)
            .allow_headers(tower_http::cors::Any)
    } else {
        CorsLayer::permissive()
    };

    let app = routes::api::create_router()
        .layer(Extension(app_state))
        .layer(cors)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        );

    tracing::info!("Server started successfully on http://0.0.0.0:8000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
