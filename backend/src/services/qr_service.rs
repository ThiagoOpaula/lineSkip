use qrcode::QrCode;
use image::Luma;
use base64::{Engine as _, engine::general_purpose};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum QrError {
    #[error("QR code generation failed: {0}")]
    GenerationFailed(String),
    #[error("Invalid data")]
    InvalidData,
}

pub struct QrService;

impl QrService {
    /// Generate a QR code from data and return as base64 encoded PNG
    pub fn generate_qr_code(data: &str) -> Result<String, QrError> {
        if data.is_empty() {
            return Err(QrError::InvalidData);
        }

        // Create QR code
        let code = QrCode::new(data.as_bytes())
            .map_err(|e| QrError::GenerationFailed(e.to_string()))?;

        // Render to image buffer
        let image_buffer = code.render::<Luma<u8>>()
            .min_dimensions(200, 200)
            .build();

        // Convert to PNG bytes
        let mut png_bytes = Vec::new();
        let mut cursor = std::io::Cursor::new(&mut png_bytes);
        image_buffer
            .write_to(&mut cursor, image::ImageFormat::Png)
            .map_err(|e| QrError::GenerationFailed(e.to_string()))?;

        // Encode to base64
        let base64_string = general_purpose::STANDARD.encode(&png_bytes);
        let data_url = format!("data:image/png;base64,{}", base64_string);

        Ok(data_url)
    }

    /// Generate a QR code for an order confirmation
    pub fn generate_order_qr(order_id: i32, user_id: i32) -> Result<String, QrError> {
        let data = format!("lineskip:order:{}:user:{}", order_id, user_id);
        Self::generate_qr_code(&data)
    }

    /// Generate a QR code for a ticket
    pub fn generate_ticket_qr(ticket_id: i32, user_id: i32) -> Result<String, QrError> {
        let data = format!("lineskip:ticket:{}:user:{}", ticket_id, user_id);
        Self::generate_qr_code(&data)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_qr_code_success() {
        let result = QrService::generate_qr_code("hello-world");
        assert!(result.is_ok());

        let qr = result.unwrap();
        assert!(qr.starts_with("data:image/png;base64,"),
            "QR output should be a base64 data URL");
        assert!(qr.len() > 100, "QR data URL should be substantial");
    }

    #[test]
    fn test_generate_qr_code_empty_data() {
        let err = QrService::generate_qr_code("").unwrap_err();
        assert!(matches!(err, QrError::InvalidData));
    }

    #[test]
    fn test_generate_qr_code_long_data() {
        let long_data = "A".repeat(1000);
        let result = QrService::generate_qr_code(&long_data);
        assert!(result.is_ok(), "should handle long data");
    }

    #[test]
    fn test_generate_order_qr() {
        let result = QrService::generate_order_qr(42, 7);
        assert!(result.is_ok());

        let qr = result.unwrap();
        assert!(qr.starts_with("data:image/png;base64,"));
    }

    #[test]
    fn test_generate_ticket_qr() {
        let result = QrService::generate_ticket_qr(100, 50);
        assert!(result.is_ok());

        let qr = result.unwrap();
        assert!(qr.starts_with("data:image/png;base64,"));
    }

    #[test]
    fn test_order_and_ticket_qr_differ() {
        let order_qr = QrService::generate_order_qr(1, 1).unwrap();
        let ticket_qr = QrService::generate_ticket_qr(1, 1).unwrap();
        assert_ne!(order_qr, ticket_qr, "different data should produce different QR codes");
    }

    #[test]
    fn test_qr_error_display() {
        assert_eq!(
            QrError::GenerationFailed("oops".to_string()).to_string(),
            "QR code generation failed: oops"
        );
        assert_eq!(
            QrError::InvalidData.to_string(),
            "Invalid data"
        );
    }
}
