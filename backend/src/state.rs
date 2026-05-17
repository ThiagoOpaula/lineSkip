use sqlx::PgPool;
use crate::services::cache_service::CacheService;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub cache: CacheService,
}

impl AppState {
    pub fn new(db: PgPool) -> Self {
        let cache = CacheService::new().expect("Failed to initialize cache service");
        Self { db, cache }
    }
}
