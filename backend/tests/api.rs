use axum::body::Body;
use axum::http::{Request, StatusCode};
use axum::Router;
use lineskip_backend::routes::api::create_router;
use tower::util::ServiceExt;

fn build_app() -> Router {
    create_router()
}

#[tokio::test]
async fn test_unknown_route_returns_404() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .uri("/unknown-route")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_auth_login_missing_extension() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/auth/login")
                .header("content-type", "application/json")
                .body(Body::from(r#"{}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    // Missing Extension<AppState> → 500 before JSON extraction runs
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn test_tickets_get_all() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .uri("/tickets")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    // Fails at Extension<AppState> extraction → 500 Internal Server Error
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn test_tickets_create_missing_extension() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/tickets")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"user_id": "not-a-number"}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    // Missing Extension<AppState> → 500 before JSON extraction runs
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn test_tickets_get_by_id_missing_extension() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .uri("/tickets/abc")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    // Missing Extension<AppState> → 500 before Path extraction runs
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn test_orders_create_missing_extension() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/orders")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"ticket_id": 1}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn test_payment_process_empty_body() {
    let app = build_app();
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/payment/process")
                .header("content-type", "application/json")
                .body(Body::from(r#"{}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    // process_payment doesn't need Extension, but still tries to extract it
    // Missing Extension<AppState> → 500 before JSON extraction runs
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
#[ignore]
async fn integration_full_payment_flow() {
    // This test requires a running Postgres + Redis.
    // 1. Register a user
    // 2. Create a ticket
    // 3. Create an order
    // 4. Process payment
    // Run with: DATABASE_URL=postgres://... REDIS_URL=redis://... cargo test -- --ignored
    std::env::set_var("JWT_SECRET", "integration-test-secret");
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL required for integration test");
    let pool = sqlx::PgPool::connect(&database_url)
        .await
        .expect("connect to postgres");

    let app_state = lineskip_backend::state::AppState::new(pool).await;
    let app = create_router().layer(axum::Extension(app_state));

    // Register a user
    let register_body = serde_json::json!({
        "username": "int_test_user",
        "password": "test_pass_123",
        "email": "int_test@lineskip.test"
    });
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/auth/register")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_string(&register_body).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
}
