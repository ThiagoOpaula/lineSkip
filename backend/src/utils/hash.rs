use argon2::{self, Config};
use rand::Rng;

pub fn hash_password(password: &str) -> Result<String, argon2::Error> {
    let salt: [u8; 16] = rand::thread_rng().gen();
    let config = Config::default();
    argon2::hash_encoded(password.as_bytes(), &salt, &config)
}

pub fn verify_password(hash: &str, password: &str) -> Result<bool, argon2::Error> {
    argon2::verify_encoded(hash, password.as_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_password_and_verify() {
        let password = "my_secure_password123!";
        let hash = hash_password(password).expect("should hash successfully");
        assert!(verify_password(&hash, password).expect("should verify"));
    }

    #[test]
    fn test_wrong_password_fails() {
        let hash = hash_password("correct_password").expect("should hash");
        assert!(!verify_password(&hash, "wrong_password").expect("should verify without error"));
    }

    #[test]
    fn test_different_salts_produce_different_hashes() {
        let password = "same_password";
        let hash1 = hash_password(password).expect("should hash");
        let hash2 = hash_password(password).expect("should hash");
        assert_ne!(hash1, hash2, "same password should produce different hashes due to salt");
    }

    #[test]
    fn test_empty_password() {
        let hash = hash_password("").expect("should hash empty password");
        assert!(verify_password(&hash, "").expect("should verify"));
    }

    #[test]
    fn test_verify_invalid_hash() {
        let result = verify_password("not-a-valid-hash", "password");
        assert!(result.is_err());
    }
}
