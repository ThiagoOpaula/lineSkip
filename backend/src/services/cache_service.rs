use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use std::env;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum CacheError {
    #[error("Redis connection failed: {0}")]
    ConnectionFailed(String),
    #[error("Cache operation failed: {0}")]
    OperationFailed(String),
}

#[derive(Clone)]
pub struct CacheService {
    manager: ConnectionManager,
}

impl CacheService {
    /// Create a new cache service with an async Redis connection manager.
    pub async fn new() -> Result<Self, CacheError> {
        let redis_url = env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());

        let client = redis::Client::open(redis_url.as_str())
            .map_err(|e| CacheError::ConnectionFailed(e.to_string()))?;

        let manager = ConnectionManager::new(client)
            .await
            .map_err(|e| CacheError::ConnectionFailed(e.to_string()))?;

        Ok(Self { manager })
    }

    /// Set a value in cache with expiration.
    pub async fn set_with_expiration<T: serde::Serialize + Send + Sync>(
        &self,
        key: &str,
        value: &T,
        expiration_seconds: u64,
    ) -> Result<(), CacheError> {
        let mut conn = self.manager.clone();

        let serialized = serde_json::to_string(value)
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        conn
            .set_ex::<_, _, ()>(key, serialized, expiration_seconds)
            .await
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        Ok(())
    }

    /// Get a value from cache.
    pub async fn get<T: serde::de::DeserializeOwned + Send + Sync>(
        &self,
        key: &str,
    ) -> Result<Option<T>, CacheError> {
        let mut conn = self.manager.clone();

        let result: Option<String> = conn
            .get::<_, Option<String>>(key)
            .await
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        match result {
            Some(data) => {
                let value: T = serde_json::from_str(&data)
                    .map_err(|e| CacheError::OperationFailed(e.to_string()))?;
                Ok(Some(value))
            }
            None => Ok(None),
        }
    }

    /// Delete a value from cache.
    pub async fn delete(&self, key: &str) -> Result<(), CacheError> {
        let mut conn = self.manager.clone();

        conn
            .del::<_, ()>(key)
            .await
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        Ok(())
    }

    /// Cache user data (1 hour expiration).
    pub async fn cache_user(&self, user_id: i32, user_data: &serde_json::Value) -> Result<(), CacheError> {
        let key = format!("user:{}", user_id);
        self.set_with_expiration(&key, user_data, 3600u64).await
    }

    /// Get cached user data.
    pub async fn get_cached_user(&self, user_id: i32) -> Result<Option<serde_json::Value>, CacheError> {
        let key = format!("user:{}", user_id);
        self.get(&key).await
    }

    /// Cache ticket data (30 minutes expiration).
    pub async fn cache_ticket(&self, ticket_id: i32, ticket_data: &serde_json::Value) -> Result<(), CacheError> {
        let key = format!("ticket:{}", ticket_id);
        self.set_with_expiration(&key, ticket_data, 1800u64).await
    }

    /// Get cached ticket data.
    pub async fn get_cached_ticket(&self, ticket_id: i32) -> Result<Option<serde_json::Value>, CacheError> {
        let key = format!("ticket:{}", ticket_id);
        self.get(&key).await
    }

    /// Cache order data (1 hour expiration).
    pub async fn cache_order(&self, order_id: i32, order_data: &serde_json::Value) -> Result<(), CacheError> {
        let key = format!("order:{}", order_id);
        self.set_with_expiration(&key, order_data, 3600u64).await
    }

    /// Get cached order data.
    pub async fn get_cached_order(&self, order_id: i32) -> Result<Option<serde_json::Value>, CacheError> {
        let key = format!("order:{}", order_id);
        self.get(&key).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    #[ignore]
    async fn test_connect_to_unreachable_redis() {
        std::env::set_var("REDIS_URL", "redis://127.0.0.1:1/");
        let result = CacheService::new().await;
        assert!(result.is_err(), "should fail for unreachable Redis");
    }

    #[tokio::test]
    #[ignore]
    async fn test_set_and_get() {
        let cache = CacheService::new().await.expect("Redis must be running");
        let value = serde_json::json!({"hello": "world"});
        cache.set_with_expiration("test:set_get", &value, 60).await.unwrap();
        let retrieved: Option<serde_json::Value> = cache.get("test:set_get").await.unwrap();
        assert_eq!(retrieved, Some(serde_json::json!({"hello": "world"})));
        cache.delete("test:set_get").await.unwrap();
        let deleted: Option<serde_json::Value> = cache.get("test:set_get").await.unwrap();
        assert!(deleted.is_none());
    }

    #[tokio::test]
    #[ignore]
    async fn test_get_nonexistent() {
        let cache = CacheService::new().await.expect("Redis must be running");
        let result: Option<serde_json::Value> = cache.get("test:nonexistent_42").await.unwrap();
        assert!(result.is_none());
    }
}
