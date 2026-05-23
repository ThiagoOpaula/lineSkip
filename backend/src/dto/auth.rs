use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
    pub email: String,
}

#[derive(Serialize)]
pub struct UserResponse {
    pub id: i32,
    pub username: String,
    pub email: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_login_request_deserialize() {
        let json = r#"{"username": "john", "password": "secret123"}"#;
        let req: LoginRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.username, "john");
        assert_eq!(req.password, "secret123");
    }

    #[test]
    fn test_register_request_deserialize() {
        let json = r#"{"username": "john", "password": "secret123", "email": "john@test.com"}"#;
        let req: RegisterRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.username, "john");
        assert_eq!(req.email, "john@test.com");
    }

    #[test]
    fn test_user_response_serialize() {
        let resp = UserResponse {
            id: 1,
            username: "john".to_string(),
            email: "john@test.com".to_string(),
        };
        let json = serde_json::to_value(resp).unwrap();
        assert_eq!(json["id"], 1);
        assert_eq!(json["username"], "john");
        assert_eq!(json["email"], "john@test.com");
    }
}
