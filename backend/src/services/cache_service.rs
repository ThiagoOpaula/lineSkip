use redis::{Client, Commands};
use thiserror::Error;
use std::env;

#[derive(Error, Debug)]
pub enum CacheError {
    #[error("Redis connection failed: {0}")]
    ConnectionFailed(String),
    #[error("Cache operation failed: {0}")]
    OperationFailed(String),
}

#[derive(Clone)]
pub struct CacheService {
    client: Client,
}

impl CacheService {
    /// Create a new cache service
    pub fn new() -> Result<Self, CacheError> {
        let redis_url = env::var("REDIS_URL")
            .unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());

        let client = Client::open(redis_url.as_str())
            .map_err(|e| CacheError::ConnectionFailed(e.to_string()))?;

        Ok(Self { client })
    }

    /// Get a connection from the pool
    fn get_connection(&self) -> Result<redis::Connection, CacheError> {
        self.client
            .get_connection()
            .map_err(|e| CacheError::ConnectionFailed(e.to_string()))
    }

    /// Set a value in cache with expiration
    pub fn set_with_expiration<T: serde::Serialize>(
        &self,
        key: &str,
        value: &T,
        expiration_seconds: u64,
    ) -> Result<(), CacheError> {
        let mut conn = self.get_connection()?;

        let serialized = serde_json::to_string(value)
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        conn.set_ex::<_, _, ()>(key, serialized, expiration_seconds)
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        Ok(())
    }

    /// Get a value from cache
    pub fn get<T: serde::de::DeserializeOwned>(
        &self,
        key: &str,
    ) -> Result<Option<T>, CacheError> {
        let mut conn = self.get_connection()?;

        let result: Option<String> = conn.get(key)
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

    /// Delete a value from cache
    pub fn delete(&self, key: &str) -> Result<(), CacheError> {
        let mut conn = self.get_connection()?;

        conn.del::<_, ()>(key)
            .map_err(|e| CacheError::OperationFailed(e.to_string()))?;

        Ok(())
    }

    /// Cache user data
    pub fn cache_user(&self, user_id: i32, user_data: &serde_json::Value) -> Result<(), CacheError> {
        let key = format!("user:{}", user_id);
        self.set_with_expiration(&key, user_data, 3600u64) // 1 hour expiration
    }

    /// Get cached user data
    pub fn get_cached_user(&self, user_id: i32) -> Result<Option<serde_json::Value>, CacheError> {
        let key = format!("user:{}", user_id);
        self.get(&key)
    }

    /// Cache ticket data
    pub fn cache_ticket(&self, ticket_id: i32, ticket_data: &serde_json::Value) -> Result<(), CacheError> {
        let key = format!("ticket:{}", ticket_id);
        self.set_with_expiration(&key, ticket_data, 1800u64) // 30 minutes expiration
    }

    /// Get cached ticket data
    pub fn get_cached_ticket(&self, ticket_id: i32) -> Result<Option<serde_json::Value>, CacheError> {
        let key = format!("ticket:{}", ticket_id);
        self.get(&key)
    }

    /// Cache order data
    pub fn cache_order(&self, order_id: i32, order_data: &serde_json::Value) -> Result<(), CacheError> {
        let key = format!("order:{}", order_id);
        self.set_with_expiration(&key, order_data, 3600u64) // 1 hour expiration
    }

    /// Get cached order data
    pub fn get_cached_order(&self, order_id: i32) -> Result<Option<serde_json::Value>, CacheError> {
        let key = format!("order:{}", order_id);
        self.get(&key)
    }
}
